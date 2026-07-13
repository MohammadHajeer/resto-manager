import { createSlug } from "@/utils/createSlug.js";
import { supabase } from "@/lib/supabase.js";
import {
  REMOTE_IMAGE_URLS,
  type SeedImageKind,
  type SeedRestaurant,
} from "./seedData.js";
import { assertSeedFileMatchesMetadata, createPng, getErrorMessage, type SeedFile } from "./seedUtils.js";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 12_000;
const allowedSeedUrls = new Set(Object.values(REMOTE_IMAGE_URLS));
const downloadCache = new Map<string, Promise<SeedFile>>();

const mimeDetails: Record<
  string,
  { extension: SeedFile["extension"]; signature?: (buffer: Buffer) => boolean }
> = {
  "image/jpeg": { extension: ".jpg", signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 },
  "image/png": { extension: ".png", signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  "image/webp": { extension: ".webp", signature: (buffer) => buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" },
};

function createFallbackImage(label: string): SeedFile {
  const hue = [...label].reduce((value, character) => value + character.charCodeAt(0), 0);
  return createPng(600, 400, (x, y) => {
    const inPlate = (x - 300) ** 2 / 150 ** 2 + (y - 190) ** 2 / 95 ** 2 <= 1;
    const stripe = (x + y + hue) % 80 < 40;
    if (inPlate) return stripe ? [245, 158, 11, 255] : [255, 247, 237, 255];
    return stripe ? [23, 32, 51, 255] : [30, 41, 59, 255];
  });
}

export function createRestaurantLogo(restaurant: SeedRestaurant): SeedFile {
  const [primary, accent] = restaurant.colors;
  const parseHex = (value: string) => [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16)) as [number, number, number];
  const primaryRgb = parseHex(primary);
  const accentRgb = parseHex(accent);
  return createPng(512, 512, (x, y) => {
    const circle = (x - 256) ** 2 + (y - 220) ** 2 <= 142 ** 2;
    const plate = y >= 215 && y <= 245 && x >= 145 && x <= 367;
    const utensil = y >= 130 && y <= 305 && ([185, 235, 285, 335].some((center) => Math.abs(x - center) <= 7));
    if (plate || utensil) return [255, 255, 255, 255];
    if (circle) return [...accentRgb, 255];
    return [...primaryRgb, 255];
  });
}

async function downloadRemoteImage(url: string): Promise<SeedFile> {
  if (!allowedSeedUrls.has(url)) throw new Error("The URL is not in the hardcoded seed allowlist");
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "https:") throw new Error("Seed images must use HTTPS");

  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    headers: { "User-Agent": "RestoManager-Development-Seed/1.0" },
  });
  if (!response.ok) throw new Error(`Image request returned HTTP ${response.status}`);

  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  const details = contentType ? mimeDetails[contentType] : undefined;
  if (!details) throw new Error(`Unsupported image content type: ${contentType ?? "missing"}`);

  const declaredSize = Number(response.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_IMAGE_BYTES) throw new Error("Image exceeds the 5MB limit");

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) throw new Error("Downloaded image has an invalid size");
  if (details.signature && !details.signature(buffer)) throw new Error("Image bytes do not match the declared content type");

  return { buffer, contentType: contentType!, extension: details.extension };
}

export async function getSeedImage(kind: SeedImageKind, fallbackLabel: string) {
  const url = REMOTE_IMAGE_URLS[kind];
  let pending = downloadCache.get(url);
  if (!pending) {
    pending = downloadRemoteImage(url);
    downloadCache.set(url, pending);
  }

  try {
    return { file: await pending, usedFallback: false as const };
  } catch (error) {
    return {
      file: createFallbackImage(fallbackLabel),
      usedFallback: true as const,
      fallbackReason: getErrorMessage(error),
    };
  }
}

export async function validateStorageConfiguration(publicBucket: string, privateBucket: string) {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`Unable to list Supabase buckets: ${error.message}`);
  const publicDefinition = data.find((bucket) => bucket.name === publicBucket || bucket.id === publicBucket);
  const privateDefinition = data.find((bucket) => bucket.name === privateBucket || bucket.id === privateBucket);
  if (!publicDefinition) throw new Error(`Supabase public bucket '${publicBucket}' does not exist`);
  if (!privateDefinition) throw new Error(`Supabase private bucket '${privateBucket}' does not exist`);
  if (!publicDefinition.public) throw new Error(`Supabase bucket '${publicBucket}' must be public`);
  if (privateDefinition.public) throw new Error(`Supabase bucket '${privateBucket}' must remain private`);
  const publicMimeTypes = publicDefinition.allowed_mime_types;
  const privateMimeTypes = privateDefinition.allowed_mime_types;
  if (publicMimeTypes && !publicMimeTypes.includes("image/png")) {
    throw new Error(`Supabase bucket '${publicBucket}' does not allow image/png`);
  }
  if (privateMimeTypes && !privateMimeTypes.includes("application/pdf")) {
    throw new Error(`Supabase bucket '${privateBucket}' does not allow application/pdf`);
  }
}

export async function pathExists(bucket: string, filePath: string) {
  const separator = filePath.lastIndexOf("/");
  const folder = filePath.slice(0, separator);
  const filename = filePath.slice(separator + 1);
  const { data, error } = await supabase.storage.from(bucket).list(folder, { search: filename, limit: 10 });
  if (error) throw new Error(`Unable to inspect ${bucket}/${filePath}: ${error.message}`);
  return data.some((entry) => entry.name === filename);
}

export async function uploadSeedFile(bucket: string, filePath: string, file: SeedFile) {
  assertSeedFileMatchesMetadata(file);
  const existed = await pathExists(bucket, filePath);
  if (existed) {
    throw new Error(`Refusing to overwrite pre-existing seed file ${bucket}/${filePath}`);
  }
  const { error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, {
    contentType: file.contentType,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Unable to upload ${bucket}/${filePath}: ${error.message}`);
  return { filePath };
}

export function publicUrlFor(bucket: string, filePath: string) {
  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
}

export function menuImagePath(restaurantSlug: string, itemName: string, extension: SeedFile["extension"]) {
  return `restaurants/${restaurantSlug}/menu-items/${createSlug(itemName)}${extension}`;
}

export async function removeSeedFile(bucket: string, filePath: string) {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw new Error(`Unable to remove ${bucket}/${filePath}: ${error.message}`);
}

import path from "node:path";
import { randomUUID } from "node:crypto";
import { supabase } from "../lib/supabase.js";

type UploadFileOptions = {
  bucket: string;
  folder: string;
  file: Express.Multer.File;
};

function getSafeExtension(file: Express.Multer.File) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext) return ext;

  if (file.mimetype === "image/jpeg") return ".jpg";
  if (file.mimetype === "image/png") return ".png";
  if (file.mimetype === "image/webp") return ".webp";
  if (file.mimetype === "application/pdf") return ".pdf";

  return "";
}

export async function uploadFileToSupabase({
  bucket,
  folder,
  file,
}: UploadFileOptions) {
  const extension = getSafeExtension(file);
  const fileName = `${randomUUID()}${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
}

export function getPublicFileUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createPrivateSignedUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_PRIVATE_BUCKET as string)
    .createSignedUrl(filePath, 60 * 5);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}

type DeleteFileOptions = {
  bucket: string;
  filePath?: string | null;
};

export async function deleteFilesFromSupabase({
  bucket,
  filePaths,
}: {
  bucket: string;
  filePaths: Array<string | null | undefined>;
}) {
  const validPaths = filePaths.filter(Boolean) as string[];

  if (validPaths.length === 0) return;

  const { error } = await supabase.storage.from(bucket).remove(validPaths);

  if (error) {
    throw new Error(error.message);
  }
}

export function getFilePathFromPublicUrl(
  bucket: string,
  publicUrl?: string | null,
) {
  if (!publicUrl) return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) return null;

  const filePath = publicUrl.slice(markerIndex + marker.length);

  return decodeURIComponent(filePath.split("?")[0]);
}

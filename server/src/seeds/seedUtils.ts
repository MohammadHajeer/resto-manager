import path from "node:path";
import { deflateSync } from "node:zlib";

export type SeedFile = {
  buffer: Buffer;
  contentType: string;
  extension: ".jpg" | ".png" | ".webp" | ".pdf";
};

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.allocUnsafe(data.length + 12);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), data.length + 8);
  return chunk;
}

export function createPng(
  width: number,
  height: number,
  pixel: (x: number, y: number) => readonly [number, number, number, number],
): SeedFile {
  const scanlines = Buffer.allocUnsafe(height * (1 + width * 4));
  for (let y = 0; y < height; y += 1) {
    const row = y * (1 + width * 4);
    scanlines[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const [red, green, blue, alpha] = pixel(x, y);
      const offset = row + 1 + x * 4;
      scanlines[offset] = red;
      scanlines[offset + 1] = green;
      scanlines[offset + 2] = blue;
      scanlines[offset + 3] = alpha;
    }
  }

  const header = Buffer.allocUnsafe(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return {
    buffer: Buffer.concat([
      PNG_SIGNATURE,
      pngChunk("IHDR", header),
      pngChunk("IDAT", deflateSync(scanlines, { level: 9 })),
      pngChunk("IEND", Buffer.alloc(0)),
    ]),
    contentType: "image/png",
    extension: ".png",
  };
}

export function assertSeedFileMatchesMetadata(file: SeedFile) {
  const valid =
    (file.extension === ".png" && file.contentType === "image/png" && file.buffer.subarray(0, 8).equals(PNG_SIGNATURE)) ||
    (file.extension === ".jpg" && file.contentType === "image/jpeg" && file.buffer[0] === 0xff && file.buffer[1] === 0xd8) ||
    (file.extension === ".webp" && file.contentType === "image/webp" && file.buffer.toString("ascii", 0, 4) === "RIFF" && file.buffer.toString("ascii", 8, 12) === "WEBP") ||
    (file.extension === ".pdf" && file.contentType === "application/pdf" && file.buffer.toString("ascii", 0, 5) === "%PDF-");
  if (!valid) {
    throw new Error(`Seed file bytes do not match ${file.extension} / ${file.contentType}`);
  }
}

export function createMulterFile(
  file: SeedFile,
  baseName: string,
): Express.Multer.File {
  const originalname = `${baseName}${file.extension}`;

  return {
    fieldname: "seedFile",
    originalname,
    encoding: "7bit",
    mimetype: file.contentType,
    size: file.buffer.length,
    buffer: file.buffer,
    destination: "",
    filename: path.basename(originalname),
    path: "",
    stream: undefined as never,
  };
}

export async function mapWithConcurrency<T, TResult>(
  values: T[],
  concurrency: number,
  mapper: (value: T, index: number) => Promise<TResult>,
) {
  const results = new Array<TResult>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, () => worker()),
  );

  return results;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

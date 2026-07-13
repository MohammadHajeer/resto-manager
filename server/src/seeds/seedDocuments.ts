import { createHash } from "node:crypto";
import type { SeedFile } from "./seedUtils.js";

function escapePdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, "-")
    .replace(/([\\()])/g, "\\$1");
}

function createSimplePdf(lines: string[]): Buffer {
  const content = [
    "BT",
    "/F1 18 Tf",
    "72 750 Td",
    ...lines.flatMap((line, index) => [
      index === 0 ? "" : "0 -34 Td",
      `(${escapePdfText(line)}) Tj`,
    ]),
    "ET",
  ]
    .filter(Boolean)
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "ascii");
}

export function createVerificationPdf(options: {
  restaurantName: string;
  ownerName: string;
  documentType: "Business License" | "Owner Identification";
  seedDate: Date;
}): SeedFile {
  const reference = createHash("sha256")
    .update(`${options.restaurantName}:${options.documentType}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();

  return {
    contentType: "application/pdf",
    extension: ".pdf",
    buffer: createSimplePdf([
      "SAMPLE DOCUMENT - FOR DEVELOPMENT ONLY",
      "NOT A REAL IDENTITY OR BUSINESS DOCUMENT",
      `Restaurant: ${options.restaurantName}`,
      `Seeded owner: ${options.ownerName}`,
      `Document type: ${options.documentType}`,
      `Fake reference: DEV-${reference}`,
      `Seed generation date: ${options.seedDate.toISOString().slice(0, 10)}`,
    ]),
  };
}


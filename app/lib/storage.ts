import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Camada de armazenamento. Em desenvolvimento grava em /public/uploads.
 * Em produção, troca a implementação por S3 / Cloudflare R2 / Google Cloud
 * Storage (ex.: Future Labs > Cloud) sem alterar quem a consome.
 */
export async function saveFile(file: File): Promise<{ url: string; size: number; mimeType: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const filename = `${crypto.randomUUID()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return {
    url: `/uploads/${filename}`,
    size: bytes.length,
    mimeType: file.type || "application/octet-stream",
  };
}

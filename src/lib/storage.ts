/**
 * Storage Service - Local for now, ready for cloud (S3, etc.) later
 * All file operations go through this layer for easy migration
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_BASE = process.env.UPLOAD_DIR || "./public/uploads";

export type UploadResult = {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
};

/**
 * Save uploaded file to local storage
 * Returns public URL path (e.g. /uploads/products/xxx.jpg)
 * In production: swap implementation to S3/Cloudflare R2 etc.
 */
export async function saveFile(
  file: File | Buffer,
  folder: string,
  filename?: string
): Promise<UploadResult> {
  try {
    const buffer = file instanceof Buffer ? file : Buffer.from(await (file as File).arrayBuffer());
    const ext = file instanceof File ? (path.extname(file.name) || ".bin") : (filename ? path.extname(filename) : ".bin");
    const safeName = filename || `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const relPath = path.join(folder, safeName);
    const fullPath = path.join(process.cwd(), "public", "uploads", folder, safeName);

    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, buffer);

    const url = `/uploads/${folder}/${safeName}`;
    return { success: true, url, path: relPath };
  } catch (e) {
    console.error("Storage save error:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Upload failed",
    };
  }
}

/** For future: cloud upload stub */
// export async function saveToCloud(...) { ... }

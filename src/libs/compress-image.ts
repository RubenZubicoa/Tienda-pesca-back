import fs from "fs";
import path from "path";
import sharp from "sharp";

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const WEBP_QUALITY = 80;

/**
 * Comprime y redimensiona una imagen a WebP antes de subirla.
 * Devuelve la ruta del archivo comprimido (temporal).
 */
export async function compressImage(filePath: string): Promise<string> {
  const parsed = path.parse(filePath);
  const outputPath = path.join(parsed.dir, `${parsed.name}-compressed.webp`);

  await sharp(filePath)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  return outputPath;
}

export function cleanupTempFile(filePath: string | undefined) {
  if (!filePath) return;
  fs.unlink(filePath, () => undefined);
}

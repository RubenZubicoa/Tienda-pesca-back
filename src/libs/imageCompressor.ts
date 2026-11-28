import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export const IMAGE_COMPRESSOR_CONFIG = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 80,
  format: "jpeg" as const,
};

function isCompressibleImage(file: Express.Multer.File) {
  const mime = file.mimetype?.toLowerCase() ?? "";
  return mime.startsWith("image/");
}

function jpegOutputPath(filePath: string) {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.jpg`);
}

/** Comprime la imagen de multer y deja el fichero listo para subir a S3. */
export async function compressImageFile(file: Express.Multer.File): Promise<Express.Multer.File> {
  if (!file.path || !isCompressibleImage(file)) {
    return file;
  }

  const outputPath = jpegOutputPath(file.path);
  const tempPath = `${file.path}.compressed.jpg`;

  try {
    const info = await sharp(file.path)
      .rotate()
      .resize(IMAGE_COMPRESSOR_CONFIG.maxWidth, IMAGE_COMPRESSOR_CONFIG.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: IMAGE_COMPRESSOR_CONFIG.quality,
        mozjpeg: true,
      })
      .toFile(tempPath);

    await fs.unlink(file.path).catch(() => undefined);
    if (outputPath !== tempPath) {
      await fs.unlink(outputPath).catch(() => undefined);
      await fs.rename(tempPath, outputPath);
    }

    file.path = outputPath;
    file.filename = path.basename(outputPath);
    file.mimetype = "image/jpeg";
    file.size = info.size;
    return file;
  } catch {
    await fs.unlink(tempPath).catch(() => undefined);
    return file;
  }
}

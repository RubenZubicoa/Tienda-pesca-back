import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import fs from "fs";
import https from "https";
import path from "path";
import { randomUUID } from "crypto";

import { compressImageFile } from "./imageCompressor";

export type S3FolderKind = "products" | "categories" | "brands" | "newsletter" | "files";

const FOLDER_ENV: Record<S3FolderKind, string> = {
  products: "AWS_BUCKET_PRODUCTS_FOLDER",
  categories: "AWS_BUCKET_CATEGORIES_FOLDER",
  brands: "AWS_BUCKET_BRANDS_FOLDER",
  newsletter: "AWS_BUCKET_NEWSLETTER_FOLDER",
  files: "AWS_BUCKET_FILES_FOLDER",
};

function getS3Config() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_CLAVE_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_CLAVE_SECRET_KEY;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const bucket =
    process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET;

  if (!accessKeyId || !secretAccessKey || !region || !bucket) {
    throw new Error(
      "Faltan variables de entorno de AWS S3 (AWS_CLAVE_ACCESS_KEY, AWS_CLAVE_SECRET_KEY, AWS_DEFAULT_REGION, AWS_BUCKET_NAME)"
    );
  }

  return {
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim(),
    region: region.trim(),
    bucket: bucket.trim(),
  };
}

function getFolder(kind: S3FolderKind): string {
  const envName = FOLDER_ENV[kind];
  const folder = process.env[envName];

  if (!folder?.trim()) {
    throw new Error(`Falta la variable de entorno ${envName}`);
  }

  return folder.trim().replace(/^\/+|\/+$/g, "");
}

function allowInsecureTls() {
  const value = process.env.AWS_S3_ALLOW_INSECURE_TLS ?? "";
  return value === "true" || value === "1";
}

function createS3Client() {
  const { accessKeyId, secretAccessKey, region } = getS3Config();
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(allowInsecureTls()
      ? {
          requestHandler: new NodeHttpHandler({
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          }),
        }
      : {}),
  });
}

function publicUrl(bucket: string, region: string, key: string) {
  const encodedKey = encodeURIComponent(key).replace(/%2F/g, "/");
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
}

function s3FileName(file: Express.Multer.File): string {
  const original = path.basename(file.originalname || file.filename || "archivo");
  const parsed = path.parse(original);
  const compressedExt = path.extname(file.filename || "");
  const ext = compressedExt || parsed.ext || "";
  const name =
    (parsed.name || "archivo")
      .replace(/[\u0000-\u001f<>:"|?*\\/]/g, "-")
      .replace(/\s+/g, "-")
      .trim()
      .slice(0, 120) || "archivo";
  const normalizedExt = ext ? (ext.startsWith(".") ? ext : `.${ext}`) : "";
  return `${Date.now()}-${randomUUID().slice(0, 8)}-${name}${normalizedExt}`;
}

function extractS3Key(url: string, bucket: string, region: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const pathname = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    const virtualHosts = [
      `${bucket}.s3.${region}.amazonaws.com`.toLowerCase(),
      `${bucket}.s3.amazonaws.com`.toLowerCase(),
    ];
    if (virtualHosts.includes(host)) return pathname || null;
    if (host === `s3.${region}.amazonaws.com`.toLowerCase() && pathname.startsWith(`${bucket}/`)) {
      return pathname.slice(bucket.length + 1) || null;
    }
    return null;
  } catch {
    return null;
  }
}

function cleanupLocalFile(filePath?: string) {
  if (!filePath) return;
  fs.unlink(filePath, () => undefined);
}

/** Firma una URL de S3 privada. En Mongo se puede guardar la URL sin firmar. */
export async function signS3Url(url?: string | null, expiresIn = 60 * 60 * 24 * 6): Promise<string> {
  if (!url?.trim()) return "";
  const { bucket, region } = getS3Config();
  const key = extractS3Key(url.trim(), bucket, region);
  if (!key) return url;

  return getSignedUrl(createS3Client(), new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn,
  });
}

/**
 * Sube un fichero de multer a S3.
 * Si `compress` es true y el archivo es imagen, se comprime antes.
 */
export async function uploadToS3(
  file: Express.Multer.File,
  kind: S3FolderKind,
  options: { compress?: boolean } = {}
) {
  const shouldCompress = options.compress !== false && file.mimetype?.startsWith("image/");
  const prepared = shouldCompress ? await compressImageFile(file) : file;
  const { bucket, region } = getS3Config();
  const folder = getFolder(kind);
  const objectName = s3FileName(prepared);
  const key = `${folder}/${objectName}`;

  try {
    await createS3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fs.createReadStream(prepared.path),
        ContentType: prepared.mimetype,
        ContentDisposition: `inline; filename="${objectName.replace(/"/g, "")}"`,
      })
    );

    return publicUrl(bucket, region, key);
  } finally {
    cleanupLocalFile(file.path);
    if (prepared.path !== file.path) cleanupLocalFile(prepared.path);
  }
}

export async function uploadProductImageToS3(file: Express.Multer.File) {
  return uploadToS3(file, "products");
}

export async function uploadCategoryImageToS3(file: Express.Multer.File) {
  return uploadToS3(file, "categories");
}

export async function uploadBrandImageToS3(file: Express.Multer.File) {
  return uploadToS3(file, "brands");
}

export async function uploadNewsletterImageToS3(file: Express.Multer.File) {
  return uploadToS3(file, "newsletter");
}

/** Documento del newsletter (PDF, etc.) en la carpeta boletines, sin comprimir. */
export async function uploadNewsletterDocumentToS3(file: Express.Multer.File) {
  return uploadToS3(file, "newsletter", { compress: false });
}

export async function uploadGeneralFileToS3(file: Express.Multer.File) {
  return uploadToS3(file, "files", { compress: false });
}

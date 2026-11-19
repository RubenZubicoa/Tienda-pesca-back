import cloudinary from "cloudinary";
import { cleanupTempFile, compressImage } from "./compress-image";

export async function uploadToCloudinary(
  file: Express.Multer.File,
  resourceType: "image" | "raw" | "auto" | "video" = "image"
) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  let uploadPath = file.path;
  let compressedPath: string | undefined;

  if (resourceType === "image") {
    compressedPath = await compressImage(file.path);
    uploadPath = compressedPath;
  }

  try {
    const uploadResult = await cloudinary.v2.uploader
      .upload(uploadPath, {
        public_id: file.filename.replace(/\.[^.]+$/, ""),
        folder: process.env.CLOUDINARY_FOLDER,
        resource_type: resourceType,
        format: resourceType === "image" ? "webp" : undefined,
      })
      .catch((error) => {
        console.log(error);
      });

    return uploadResult?.secure_url;
  } finally {
    cleanupTempFile(file.path);
    cleanupTempFile(compressedPath);
  }
}

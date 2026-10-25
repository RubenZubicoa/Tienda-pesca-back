import cloudinary from 'cloudinary';

export async function uploadToCloudinary(
  file: Express.Multer.File,
  resourceType: "image" | "raw" | "auto" | "video" = "image"
) {
    cloudinary.v2.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });
    
    const uploadResult = await cloudinary.v2.uploader
       .upload(
           file.path, {
               public_id: file.filename,
               folder: process.env.CLOUDINARY_FOLDER,
               resource_type: resourceType,
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    return uploadResult?.secure_url;
}
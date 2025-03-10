import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures", // Folder in your Cloudinary account
    allowed_formats: ["jpeg", "png", "jpg"], // Allowed file formats
    transformation: [{ width: 300, height: 300, crop: "fill" }], // Resize image
  },
});



export default { storage};

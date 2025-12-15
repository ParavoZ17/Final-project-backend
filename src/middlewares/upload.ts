import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// --- Cloudinary config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// --- Аватари ---
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "avatars",
    format: "png", 
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

export const uploadAvatar = multer({ storage: avatarStorage });

// --- Постові фото ---
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "posts",
    format: "jpg", 
    transformation: [{ width: 1080, height: 1080, crop: "limit" }],
  }),
});

export const uploadPostImages = multer({ storage: postStorage });

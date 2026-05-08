import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string, folder = 'wandrer/tours') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteImage = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;

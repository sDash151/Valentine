import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Server-side upload functions (no preset needed!)
export const uploadToCloudinary = async (
  file: File,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      resource_type: resourceType,
      folder: 'valentine-week',
      timeout: 300000, // 5 minutes timeout
    };

    // For videos, add additional options
    if (resourceType === 'video') {
      uploadOptions.chunk_size = 6000000; // 6MB chunks
      uploadOptions.eager_async = true; // Process asynchronously
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    ).end(buffer);
  });
};

export const uploadImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'image');
};

export const uploadVideo = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'video');
};

export const uploadAudio = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'raw');
};

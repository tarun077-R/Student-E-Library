import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  bytes?: number;
  format?: string;
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: 'elibrary/covers' | 'elibrary/books',
  resourceType: 'image' | 'raw' = 'image',
  format?: string
): Promise<CloudinaryUploadResult> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      folder,
      resource_type: resourceType,
      access_mode: 'public',
    };

    if (format) {
      options.format = format;
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        return reject(error || new Error('Upload to Cloudinary failed'));
      }
      resolve({
        secure_url: result.secure_url,
        public_id: result.public_id,
        bytes: result.bytes,
        format: result.format,
      });
    });

    uploadStream.end(buffer);
  });
}

export default cloudinary;

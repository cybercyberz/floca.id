// Avoid using server-only packages
// import { v2 as cloudinary } from 'cloudinary';

// Define types for Cloudinary upload responses
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Uploads an image to Cloudinary using the direct upload API
 * This approach works in both client and server components
 */
export const uploadImage = async (file: File): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not defined');
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  return response.json();
};

/**
 * Generates a Cloudinary URL with optional transformations
 */
export const generateImageUrl = (
  publicId: string, 
  options: { width?: number; height?: number; quality?: number } = {}
): string => {
  const { width, height, quality = 90 } = options;
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.error('Cloudinary cloud name is not defined');
    return publicId; // Return the original ID as fallback
  }
  
  const transformationString = transformations.length > 0 
    ? `${transformations.join(',')}/` 
    : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`;
}; 
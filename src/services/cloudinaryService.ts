import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  // Upload image to Cloudinary
  async uploadImage(file: File, folder: string = 'lyfind'): Promise<string> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);

      // Upload to Cloudinary
      const cloudName = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || '';
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadMultipleImages(files: File[], folder: string = 'lyfind'): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  },

  // Delete image from Cloudinary
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      // Note: Deletion requires server-side implementation with API secret
      // For now, we'll just return true
      // In production, implement this on the backend
      console.log('Delete image:', publicId);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  // Get optimized image URL
  getOptimizedUrl(url: string, width?: number, height?: number): string {
    if (!url.includes('cloudinary.com')) return url;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push('c_fill', 'q_auto', 'f_auto');

    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
    }

    return url;
  },

  // Generate thumbnail URL
  getThumbnailUrl(url: string): string {
    return this.getOptimizedUrl(url, 400, 400);
  }
};

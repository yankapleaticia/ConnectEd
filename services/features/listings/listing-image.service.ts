import { getSupabaseClient } from '@/services/api/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGES = 5;

export interface UploadImagesResult {
  readonly success: true;
  readonly urls: readonly string[];
}

export interface UploadImagesError {
  readonly success: false;
  readonly error: string;
}

export type UploadImagesResponse = UploadImagesResult | UploadImagesError;

export const listingImageService = {
  async uploadListingImages(
    userId: string,
    listingId: string,
    files: File[]
  ): Promise<UploadImagesResponse> {
    try {
      // Validate number of files
      if (files.length === 0) {
        return {
          success: false,
          error: 'Please select at least one image.',
        };
      }

      if (files.length > MAX_IMAGES) {
        return {
          success: false,
          error: `Maximum ${MAX_IMAGES} images allowed.`,
        };
      }

      // Validate all files
      for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          return {
            success: false,
            error: 'Invalid file type. Please upload JPEG, PNG, or WebP images only.',
          };
        }

        if (file.size > MAX_FILE_SIZE) {
          return {
            success: false,
            error: 'File size too large. Please upload images smaller than 5MB.',
          };
        }
      }

      const supabase = getSupabaseClient();
      const uploadedUrls: string[] = [];

      // Upload each file
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${userId}/${listingId}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          return { success: false, error: uploadError.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          return { success: false, error: 'Failed to get public URL for uploaded image' };
        }

        uploadedUrls.push(urlData.publicUrl);
      }

      return { success: true, urls: uploadedUrls };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during upload' };
    }
  },
};

import { getSupabaseClient } from '@/services/api/client';
import { getConfig } from '@/config/env';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadAvatarResult {
  readonly success: true;
  readonly url: string;
}

export interface UploadAvatarError {
  readonly success: false;
  readonly error: string;
}

export type UploadAvatarResponse = UploadAvatarResult | UploadAvatarError;

export const profileImageService = {
  async uploadAvatar(userId: string, file: File): Promise<UploadAvatarResponse> {
    try {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return {
          success: false,
          error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
        };
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'File size too large. Please upload an image smaller than 2MB.',
        };
      }

      const supabase = getSupabaseClient();
      const config = getConfig();
      
      // Generate unique filename - path relative to bucket (no bucket prefix)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        return { success: false, error: 'Failed to get public URL for uploaded image' };
      }

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during upload' };
    }
  },
};

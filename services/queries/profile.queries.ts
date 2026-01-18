import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/features/profile/profile.service';
import { profileImageService } from '@/services/features/profile/profile-image.service';
import type { CreateProfileParams, UpdateProfileParams } from '@/services/features/profile/profile.types';

export const profileQueries = {
  useProfile: (userId: string | null) => {
    return useQuery({
      queryKey: ['profile', userId],
      queryFn: () => {
        if (!userId) throw new Error('User ID is required');
        return profileService.getProfile(userId);
      },
      enabled: !!userId,
    });
  },

  useCreateProfile: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, params }: { userId: string; params: CreateProfileParams }) =>
        profileService.createProfile(userId, params),
      onSuccess: (data, variables) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
          queryClient.invalidateQueries({ queryKey: ['auth'] });
        }
      },
    });
  },

  useUpdateProfile: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, params }: { userId: string; params: UpdateProfileParams }) =>
        profileService.updateProfile(userId, params),
      onSuccess: (data, variables) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
          queryClient.invalidateQueries({ queryKey: ['auth'] });
        }
      },
    });
  },

  useUploadAvatar: () => {
    return useMutation({
      mutationFn: ({ userId, file }: { userId: string; file: File }) =>
        profileImageService.uploadAvatar(userId, file),
    });
  },
};

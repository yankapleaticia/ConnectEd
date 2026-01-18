import { getSupabaseClient } from '@/services/api/client';
import type { Profile } from '@/types/domain/user';
import type { CreateProfileParams, UpdateProfileParams, ProfileResponse } from './profile.types';

function mapSupabaseProfile(row: {
  id: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  location_city: string | null;
  location_country: string | null;
  phone: string | null;
  languages: string[] | null;
  avatar_url: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}): Profile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    bio: row.bio,
    locationCity: row.location_city,
    locationCountry: row.location_country,
    phone: row.phone,
    languages: row.languages ?? [],
    avatarUrl: row.avatar_url,
    profileCompleted: row.profile_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const profileService = {
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Profile not found' };
        }
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Profile not found' };
      }

      const profile = mapSupabaseProfile(data);
      return { success: true, profile };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async createProfile(userId: string, params: CreateProfileParams): Promise<ProfileResponse> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: params.firstName,
          last_name: params.lastName,
          bio: params.bio ?? null,
          location_city: params.locationCity ?? null,
          location_country: params.locationCountry ?? null,
          phone: params.phone ?? null,
          languages: params.languages ?? [],
          avatar_url: params.avatarUrl ?? null,
          profile_completed: false,
        } as never)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to create profile' };
      }

      const profile = mapSupabaseProfile(data);
      return { success: true, profile };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async updateProfile(userId: string, params: UpdateProfileParams): Promise<ProfileResponse> {
    try {
      const supabase = getSupabaseClient();
      
      const updateData: Record<string, unknown> = {};
      if (params.firstName !== undefined) updateData.first_name = params.firstName;
      if (params.lastName !== undefined) updateData.last_name = params.lastName;
      if (params.bio !== undefined) updateData.bio = params.bio ?? null;
      if (params.locationCity !== undefined) updateData.location_city = params.locationCity ?? null;
      if (params.locationCountry !== undefined) updateData.location_country = params.locationCountry ?? null;
      if (params.phone !== undefined) updateData.phone = params.phone ?? null;
      if (params.languages !== undefined) updateData.languages = params.languages;
      if (params.avatarUrl !== undefined) updateData.avatar_url = params.avatarUrl ?? null;
      if (params.profileCompleted !== undefined) updateData.profile_completed = params.profileCompleted;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData as never)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to update profile' };
      }

      const profile = mapSupabaseProfile(data);
      return { success: true, profile };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async checkProfileCompleted(userId: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_completed')
        .eq('id', userId)
        .single() as { data: { profile_completed: boolean } | null; error: any };

      if (error || !data) {
        return false;
      }

      return data.profile_completed;
    } catch (error) {
      return false;
    }
  },
};

import type { Profile } from '@/types/domain/user';

export interface CreateProfileParams {
  readonly firstName: string;
  readonly lastName: string;
  readonly bio?: string;
  readonly locationCity?: string;
  readonly locationCountry?: string;
  readonly phone?: string;
  readonly languages?: readonly string[];
  readonly avatarUrl?: string;
}

export interface UpdateProfileParams {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly bio?: string;
  readonly locationCity?: string;
  readonly locationCountry?: string;
  readonly phone?: string;
  readonly languages?: readonly string[];
  readonly avatarUrl?: string;
  readonly profileCompleted?: boolean;
}

export interface ProfileResult {
  readonly success: true;
  readonly profile: Profile;
}

export interface ProfileError {
  readonly success: false;
  readonly error: string;
}

export type ProfileResponse = ProfileResult | ProfileError;

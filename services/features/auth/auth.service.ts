import { supabase } from '@/services/api/client';
import type { User } from '@/types/domain/user';
import type { SignupParams, LoginParams, AuthResponse } from './auth.types';

function mapSupabaseUser(supabaseUser: { id: string; email?: string; created_at: string }): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    createdAt: supabaseUser.created_at,
  };
}

export const authService = {
  async signup(params: SignupParams): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return { success: false, error: 'This email is already registered' };
        }
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Signup failed. Please try again.' };
      }

      const user = mapSupabaseUser(data.user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during signup' };
    }
  },

  async login(params: LoginParams): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid')) {
          return { success: false, error: 'Invalid email or password' };
        }
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      const user = mapSupabaseUser(data.user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during login' };
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },
};

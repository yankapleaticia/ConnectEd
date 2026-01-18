import { getSupabaseClient } from '@/services/api/client';
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
      const supabase = getSupabaseClient();

      const emailRedirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return { success: false, error: 'This email is already registered' };
        }
        return { success: false, error: error.message };
      }

      // If email confirmation is enabled, Supabase may return a user but no session.
      if (!data.user) {
        return { success: false, error: 'Signup failed. Please try again.' };
      }

      if (data.session?.user) {
        const user = mapSupabaseUser(data.session.user);
        return { success: true, status: 'authenticated', user };
      }

      return { success: true, status: 'needs_email_confirmation', email: params.email };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during signup' };
    }
  },

  async login(params: LoginParams): Promise<AuthResponse> {
    try {
      const supabase = getSupabaseClient();
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
      return { success: true, status: 'authenticated', user };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during login' };
    }
  },

  async logout(): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  },
};

import type { User } from '@/types/domain/user';

export interface SignupParams {
  readonly email: string;
  readonly password: string;
}

export interface LoginParams {
  readonly email: string;
  readonly password: string;
}

export interface AuthAuthenticated {
  readonly success: true;
  readonly status: 'authenticated';
  readonly user: User;
}

export interface AuthNeedsEmailConfirmation {
  readonly success: true;
  readonly status: 'needs_email_confirmation';
  readonly email: string;
}

export interface AuthError {
  readonly success: false;
  readonly error: string;
}

export type AuthResponse = AuthAuthenticated | AuthNeedsEmailConfirmation | AuthError;

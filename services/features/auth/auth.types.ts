import type { User } from '@/types/domain/user';

export interface SignupParams {
  readonly email: string;
  readonly password: string;
}

export interface LoginParams {
  readonly email: string;
  readonly password: string;
}

export interface AuthResult {
  readonly success: true;
  readonly user: User;
}

export interface AuthError {
  readonly success: false;
  readonly error: string;
}

export type AuthResponse = AuthResult | AuthError;

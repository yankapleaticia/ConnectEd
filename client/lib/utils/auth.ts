import type { User } from '@/types/domain/user';

export function isAuthenticated(user: User | null): user is User {
  return user !== null;
}

export function canEditContent(user: User | null, authorId: string): boolean {
  return isAuthenticated(user) && user.id === authorId;
}

export function canCreateContent(user: User | null): boolean {
  return isAuthenticated(user);
}

export interface Profile {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly bio: string | null;
  readonly locationCity: string | null;
  readonly locationCountry: string | null;
  readonly phone: string | null;
  readonly languages: readonly string[];
  readonly avatarUrl: string | null;
  readonly profileCompleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;
  readonly profile?: Profile;
}

import type { Category } from './category';

export interface Listing {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly category: Category;
  readonly authorId: string;
  readonly imageUrls?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

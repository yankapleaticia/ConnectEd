import type { Listing } from '@/types/domain/listing';
import type { Category } from '@/types/domain/category';

export interface CreateListingParams {
  readonly title: string;
  readonly body: string;
  readonly category: Category;
  readonly imageUrls?: readonly string[];
}

export interface UpdateListingParams {
  readonly title?: string;
  readonly body?: string;
  readonly category?: Category;
  readonly imageUrls?: readonly string[];
}

export interface ListingResult {
  readonly success: true;
  readonly listing: Listing;
}

export interface ListingError {
  readonly success: false;
  readonly error: string;
}

export type ListingResponse = ListingResult | ListingError;

export interface ListingsFilters {
  readonly category?: Category;
  readonly authorId?: string;
  readonly search?: string;
  readonly sortBy?: 'newest' | 'oldest';
  readonly dateFrom?: string;
  readonly dateTo?: string;
}

'use client';

import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { listingsQueries } from '@/services/queries/listings.queries';
import { ListingCard } from './listing-card';
import { PostComposer } from './post-composer';
import { EmptyListingsState } from './empty-listings-state';
import type { ListingsFilters } from '@/services/features/listings/listings.types';

interface ListingsFeedProps {
  readonly filters?: ListingsFilters;
  readonly onPostSuccess?: () => void;
}

export function ListingsFeed({ filters, onPostSuccess }: ListingsFeedProps) {
  const t = useTranslations('listings.feed');
  const user = useAuthStore((state) => state.user);
  const { data: listings, isLoading, error } = listingsQueries.useListings(filters);

  const hasFilters = filters && (filters.category || filters.search || filters.authorId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-error)' }}>Error loading listings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Post Composer - show for authenticated users (even with filters) */}
      {user ? <PostComposer onPostSuccess={onPostSuccess} /> : null}

      {/* Listings or Empty State */}
      {!listings || listings.length === 0 ? (
        <EmptyListingsState hasFilters={!!hasFilters} />
      ) : (
        <div>
          {listings.map((listing) => (
            <div key={listing.id} className="mb-6 sm:mb-8 last:mb-0">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useTranslations } from '@/client/lib/i18n';
import { listingsQueries } from '@/services/queries/listings.queries';
import { ProfileListingCard } from './profile-listing-card';

interface ProfileListingsFeedProps {
  readonly userId: string;
}

export function ProfileListingsFeed({ userId }: ProfileListingsFeedProps) {
  const t = useTranslations('profile.view');
  const { data: listings, isLoading, error } = listingsQueries.useListings({ authorId: userId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
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

  if (!listings || listings.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('noListings')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {listings.map((listing) => (
        <ProfileListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

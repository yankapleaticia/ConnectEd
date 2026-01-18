'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { listingsQueries } from '@/services/queries/listings.queries';
import { EditListingForm } from '@/client/components/features/listings/edit-listing-form';

export default function EditListingPage() {
  const t = useTranslations('listings.edit');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { data: listingResponse, isLoading: isLoadingListing } = listingsQueries.useListing(id);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoadingListing && listingResponse) {
      if (!listingResponse.success) {
        router.push('/');
        return;
      }

      if (user && listingResponse.listing.authorId !== user.id) {
        router.push(`/listings/${id}`);
      }
    }
  }, [listingResponse, user, id, isLoadingListing, router]);

  if (isLoading || isLoadingListing) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!listingResponse || !listingResponse.success) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-error)' }}>{t('notFound')}</p>
      </div>
    );
  }

  if (listingResponse.listing.authorId !== user.id) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-error)' }}>{t('unauthorized')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h1>
      </div>
      <div className="rounded-xl border p-4 sm:p-6 lg:p-8" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <EditListingForm listing={listingResponse.listing} userId={user.id} />
      </div>
    </div>
  );
}

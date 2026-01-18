'use client';

import { useState } from 'react';
import { useTranslations } from '@/client/lib/i18n';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/features/auth.store';
import { listingsQueries } from '@/services/queries/listings.queries';
import type { Listing } from '@/types/domain/listing';
import { CATEGORIES } from '@/types/domain/category';

interface ProfileListingCardProps {
  readonly listing: Listing;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getCategoryLabel(category: Listing['category']): string {
  const categoryMap: Record<Listing['category'], string> = {
    JOBS: 'jobs',
    HOUSING: 'housing',
    RELOCATION: 'relocation',
    DAILY_LIFE: 'dailyLife',
  };
  return categoryMap[category] ?? 'jobs';
}

export function ProfileListingCard({ listing }: ProfileListingCardProps) {
  const t = useTranslations('common.categories');
  const tCard = useTranslations('listings.card');
  const tProfile = useTranslations('profile.listings');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const deleteMutation = listingsQueries.useDeleteListing();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const categoryLabel = getCategoryLabel(listing.category);
  const canEdit = user && user.id === listing.authorId;

  const handleDelete = async () => {
    if (!user) return;
    
    const result = await deleteMutation.mutateAsync({ id: listing.id, userId: user.id });
    
    if (result.success) {
      setShowDeleteConfirm(false);
      router.refresh();
    }
  };

  return (
    <article 
      className="border rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3">
        <div className="flex-1">
          <Link href={`/listings/${listing.id}`}>
            <h2 
              className="text-lg sm:text-xl font-semibold mb-2 transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            >
              {listing.title}
            </h2>
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span 
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
              }}
            >
              {t(categoryLabel)}
            </span>
            <span 
              className="text-xs sm:text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatDate(listing.createdAt)}
            </span>
          </div>
        </div>
        {canEdit && !showDeleteConfirm && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={`/listings/${listing.id}/edit`}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors text-center"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              {tProfile('edit')}
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-error-text)',
              }}
            >
              {tProfile('delete')}
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm ? (
        <div className="space-y-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>{tProfile('deleteConfirm')}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-error-text)',
              }}
            >
              {deleteMutation.isPending ? tProfile('deleting') : tProfile('delete')}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              {tProfile('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p 
            className="mb-4 line-clamp-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {listing.body}
          </p>
          <Link href={`/listings/${listing.id}`}>
            <span 
              className="text-sm transition-colors inline-block"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            >
              {tCard('readMore')}
            </span>
          </Link>
        </>
      )}
    </article>
  );
}

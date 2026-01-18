'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { CommentsList } from '@/client/components/features/comments/comments-list';
import { ListingImageGallery } from './listing-image-gallery';
import { Calendar, Tag, Edit } from 'lucide-react';
import type { Listing } from '@/types/domain/listing';
import { CATEGORIES } from '@/types/domain/category';

interface ListingDetailProps {
  readonly listing: Listing;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

export function ListingDetail({ listing }: ListingDetailProps) {
  const t = useTranslations('common.categories');
  const tDetail = useTranslations('listings.detail');
  const tEdit = useTranslations('listings.edit');
  const user = useAuthStore((state) => state.user);
  const { data: authorProfile } = profileQueries.useProfile(listing.authorId);
  const categoryLabel = getCategoryLabel(listing.category);
  const canEdit = user && user.id === listing.authorId;
  const hasImages = listing.imageUrls && listing.imageUrls.length > 0;

  const authorName = authorProfile?.success
    ? `${authorProfile.profile.firstName} ${authorProfile.profile.lastName}`
    : listing.authorId;

  const avatarUrl = authorProfile?.success ? authorProfile.profile.avatarUrl : null;
  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          {canEdit && (
            <div className="mb-4 sm:mb-6 flex justify-end">
              <Link
                href={`/listings/${listing.id}/edit`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Edit size={16} />
                {tEdit('title')}
              </Link>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span 
              className="px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
              }}
            >
              <Tag size={14} />
              {t(categoryLabel)}
            </span>
            <span 
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {tDetail('category')}
            </span>
          </div>
          <h1 
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {listing.title}
          </h1>
          <div 
            className="flex flex-wrap items-center gap-3 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                {displayUrl ? (
                  isDataUrl || isExternalUrl ? (
                    <img
                      src={displayUrl}
                      alt={authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={displayUrl}
                      alt={authorName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 24px, 28px"
                    />
                  )
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {authorName[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span>
                {tDetail('by')} {authorName}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {tDetail('posted')} {formatDate(listing.createdAt)}
            </span>
            {listing.updatedAt !== listing.createdAt && (
              <span>
                {tDetail('updated')} {formatDate(listing.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {hasImages && listing.imageUrls && (
          <div className="mb-6 sm:mb-8">
            <ListingImageGallery
              images={listing.imageUrls}
              title={listing.title}
              variant="detail"
            />
          </div>
        )}

        <div className="prose max-w-none mb-8 sm:mb-10">
          <div 
            className="rounded-lg border p-4 sm:p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <p 
              className="leading-relaxed whitespace-pre-wrap text-base sm:text-lg"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {listing.body}
            </p>
          </div>
        </div>

        <CommentsList listingId={listing.id} />
      </article>
    </>
  );
}

'use client';

import { useTranslations } from '@/client/lib/i18n';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, User } from 'lucide-react';
import { profileQueries } from '@/services/queries/profile.queries';
import { ListingImageGallery } from './listing-image-gallery';
import type { Listing } from '@/types/domain/listing';
import { CATEGORIES } from '@/types/domain/category';

interface ListingCardProps {
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

export function ListingCard({ listing }: ListingCardProps) {
  const t = useTranslations('common.categories');
  const tCard = useTranslations('listings.card');
  const { data: authorProfile } = profileQueries.useProfile(listing.authorId);

  const categoryLabel = getCategoryLabel(listing.category);
  const hasImages = listing.imageUrls && listing.imageUrls.length > 0;

  const authorName = authorProfile?.success
    ? `${authorProfile.profile.firstName} ${authorProfile.profile.lastName}`
    : listing.authorId;

  const avatarUrl = authorProfile?.success ? authorProfile.profile.avatarUrl : null;
  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  return (
    <Link href={`/listings/${listing.id}`}>
      <article 
        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Image Gallery */}
        {hasImages && listing.imageUrls && (
          <div className="w-full flex-shrink-0">
            <ListingImageGallery
              images={listing.imageUrls}
              title={listing.title}
              variant="card"
            />
          </div>
        )}

        <div className="p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 
              className="text-lg sm:text-xl font-semibold flex-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {listing.title}
            </h2>
            <span 
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full flex-shrink-0 flex items-center gap-1"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
              }}
            >
              <Tag size={12} />
              {t(categoryLabel)}
            </span>
          </div>
          <p 
            className="mb-4 line-clamp-2 text-sm sm:text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {listing.body}
          </p>
          <div 
            className="flex items-center gap-2 text-xs sm:text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
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
                    sizes="(max-width: 640px) 20px, 24px"
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
            <span>{authorName}</span>
            <span>•</span>
            <Calendar size={14} />
            <span>{formatDate(listing.createdAt)}</span>
            <span 
              className="ml-auto transition-colors"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            >
              {tCard('readMore')} →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

'use client';

import { X } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import Image from 'next/image';
import type { Category } from '@/types/domain/category';
import { CATEGORIES } from '@/types/domain/category';

interface ListingPreviewModalProps {
  readonly title: string;
  readonly body: string;
  readonly category: Category | undefined;
  readonly images: readonly string[];
  readonly onClose: () => void;
  readonly onPost: () => void;
  readonly isPosting: boolean;
}

function getCategoryLabel(category: Category): string {
  const categoryMap: Record<Category, string> = {
    JOBS: 'jobs',
    HOUSING: 'housing',
    RELOCATION: 'relocation',
    DAILY_LIFE: 'dailyLife',
  };
  return categoryMap[category] ?? 'jobs';
}

export function ListingPreviewModal({
  title,
  body,
  category,
  images,
  onClose,
  onPost,
  isPosting,
}: ListingPreviewModalProps) {
  const t = useTranslations('listings.preview');
  const tCategories = useTranslations('common.categories');
  const user = useAuthStore((state) => state.user);
  const { data: profileData } = profileQueries.useProfile(user?.id ?? null);

  const profile = profileData?.success ? profileData.profile : null;
  const avatarUrl = profile?.avatarUrl;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email ?? 'User';

  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {t('title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
              {displayUrl ? (
                isDataUrl || isExternalUrl ? (
                  <img
                    src={displayUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={displayUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                )
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {displayName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {displayName}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Now
              </p>
            </div>
          </div>

          {/* Category */}
          {category && (
            <div>
              <span
                className="px-3 py-1 text-sm font-medium rounded-full inline-block"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-text)',
                }}
              >
                {tCategories(getCategoryLabel(category))}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>

          {/* Body */}
          <p
            className="leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {body}
          </p>

          {/* Images */}
          {images.length > 0 && (
            <div className="space-y-2">
              {images.length === 1 ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  {images[0].startsWith('data:') || images[0].startsWith('http://') || images[0].startsWith('https://') ? (
                    <img
                      src={images[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={images[0]}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      {imageUrl.startsWith('data:') || imageUrl.startsWith('http://') || imageUrl.startsWith('https://') ? (
                        <img
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 336px"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 p-4 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPosting}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {t('edit')}
          </button>
          <button
            type="button"
            onClick={onPost}
            disabled={isPosting}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-text)',
            }}
            onMouseEnter={(e) => {
              if (!isPosting) {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            }}
          >
            {isPosting ? t('posting') : t('post')}
          </button>
        </div>
      </div>
    </div>
  );
}

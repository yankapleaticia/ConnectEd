'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { listingsQueries } from '@/services/queries/listings.queries';
import { ListingImageUpload } from './listing-image-upload';
import { ListingPreviewModal } from './listing-preview-modal';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { CATEGORIES } from '@/types/domain/category';
import type { Category } from '@/types/domain/category';

interface PostComposerProps {
  readonly onPostSuccess?: () => void;
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

export function PostComposer({ onPostSuccess }: PostComposerProps) {
  const t = useTranslations('listings.composer');
  const tForm = useTranslations('listings.create.form');
  const tCategories = useTranslations('common.categories');
  const tValidation = useTranslations('listings.create.validation');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: profileData } = profileQueries.useProfile(user?.id ?? null);
  const createMutation = listingsQueries.useCreateListing();
  const updateMutation = listingsQueries.useUpdateListing();
  const uploadImagesMutation = listingsQueries.useUploadListingImages();

  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const profile = profileData?.success ? profileData.profile : null;
  const avatarUrl = profile?.avatarUrl;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email ?? 'User';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = tValidation('titleRequired');
    } else if (title.trim().length < 5) {
      newErrors.title = tValidation('titleMin');
    }

    if (!body.trim()) {
      newErrors.body = tValidation('bodyRequired');
    } else if (body.trim().length < 20) {
      newErrors.body = tValidation('bodyMin');
    }

    if (!category) {
      newErrors.category = tValidation('categoryRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTitle('');
    setBody('');
    setCategory(undefined);
    setImages([]);
    setErrors({});
  };

  const handlePreview = () => {
    if (validate()) {
      setShowPreview(true);
    }
  };

  const handlePost = async () => {
    if (!user || !category) return;

    setIsUploading(true);
    setShowPreview(false);

    try {
      // Convert data URLs to Files for upload
      const files: File[] = [];
      for (const imageUrl of images) {
        if (imageUrl.startsWith('data:')) {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}-${Math.random().toString(36).substring(7)}.png`, { type: blob.type });
          files.push(file);
        }
      }

      // First create the listing (without images for now)
      const listingResult = await createMutation.mutateAsync({
        params: {
          title: title.trim(),
          body: body.trim(),
          category,
        },
        authorId: user.id,
      });

      if (!listingResult.success) {
        setErrors({ submit: listingResult.error });
        setIsUploading(false);
        return;
      }

      // If there are images, upload them and update listing
      if (files.length > 0) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          userId: user.id,
          listingId: listingResult.listing.id,
          files,
        });

        if (uploadResult.success) {
          // Update listing with image URLs
          const updateResult = await updateMutation.mutateAsync({
            id: listingResult.listing.id,
            params: { imageUrls: uploadResult.urls },
            userId: user.id,
          });

          if (!updateResult.success) {
            console.error('Failed to update listing with images:', updateResult.error);
            // Continue anyway - images are uploaded, just not linked
          }
        } else {
          console.error('Failed to upload images:', uploadResult.error);
          // Continue anyway - listing is created
        }
      }

      // Reset form
      handleCancel();
      setIsUploading(false);

      // Redirect to the new listing
      router.push(`/listings/${listingResult.listing.id}`);
      onPostSuccess?.();
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
      setIsUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  return (
    <>
      <div
        className="rounded-xl border p-4 sm:p-6 mb-6"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        {!isExpanded ? (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
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
                      sizes="48px"
                    />
                  )
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <span
                      className="text-lg font-semibold"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {displayName[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              placeholder={t('placeholder')}
              onFocus={handleInputFocus}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm sm:text-base"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
              }}
              readOnly
            />
            <button
              type="button"
              onClick={handleInputFocus}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ImageIcon size={24} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Create Listing
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label
                htmlFor="composer-title"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('title')}
              </label>
              <input
                id="composer-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('titlePlaceholder')}
                className="w-full px-4 py-2.5 rounded-lg transition-colors"
                style={{
                  border: `1px solid ${errors.title ? 'var(--color-error)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.title ? 'var(--color-error)' : 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {errors.title && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('category')}
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={
                      category === cat
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-primary-text)',
                          }
                        : {
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text-secondary)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (category !== cat) {
                        e.currentTarget.style.backgroundColor = 'var(--color-border)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (category !== cat) {
                        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                      }
                    }}
                  >
                    {tCategories(getCategoryLabel(cat))}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="composer-body"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('body')}
              </label>
              <textarea
                id="composer-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t('bodyPlaceholder')}
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg transition-colors resize-y overflow-y-auto"
                style={{
                  border: `1px solid ${errors.body ? 'var(--color-error)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  maxHeight: '400px',
                  minHeight: '120px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.body ? 'var(--color-error)' : 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {errors.body && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
                  {errors.body}
                </p>
              )}
            </div>

            <ListingImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
              disabled={isUploading}
            />

            {errors.submit && (
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-error-text)',
                }}
              >
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handlePreview}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-text)',
                }}
                onMouseEnter={(e) => {
                  if (!isUploading) {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                }}
              >
                Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <ListingPreviewModal
          title={title.trim()}
          body={body.trim()}
          category={category}
          images={images}
          onClose={() => setShowPreview(false)}
          onPost={handlePost}
          isPosting={isUploading}
        />
      )}
    </>
  );
}

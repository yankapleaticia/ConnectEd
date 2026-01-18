'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { listingsQueries } from '@/services/queries/listings.queries';
import { ListingImageUpload } from './listing-image-upload';
import { CATEGORIES } from '@/types/domain/category';
import type { Category } from '@/types/domain/category';
import type { Listing } from '@/types/domain/listing';
import type { UpdateListingParams } from '@/services/features/listings/listings.types';

interface EditListingFormProps {
  readonly listing: Listing;
  readonly userId: string;
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

export function EditListingForm({ listing, userId }: EditListingFormProps) {
  const t = useTranslations('listings.edit');
  const tCreate = useTranslations('listings.create');
  const tCategories = useTranslations('common.categories');
  const tValidation = useTranslations('listings.create.validation');
  const router = useRouter();
  const updateMutation = listingsQueries.useUpdateListing();
  const uploadImagesMutation = listingsQueries.useUploadListingImages();

  const [title, setTitle] = useState(listing.title);
  const [body, setBody] = useState(listing.body);
  const [category, setCategory] = useState<Category>(listing.category);
  const [images, setImages] = useState<string[]>(listing.imageUrls ? [...listing.imageUrls] : []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTitle(listing.title);
    setBody(listing.body);
    setCategory(listing.category);
    setImages(listing.imageUrls ? [...listing.imageUrls] : []);
  }, [listing]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsUploading(true);

    try {
      // Separate existing images (URLs) from new images (data URLs)
      const existingImages = images.filter(img => !img.startsWith('data:'));
      const newImageDataUrls = images.filter(img => img.startsWith('data:'));

      // Convert data URLs to Files for upload
      const files: File[] = [];
      for (const imageUrl of newImageDataUrls) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `image-${Date.now()}-${Math.random().toString(36).substring(7)}.png`, { type: blob.type });
        files.push(file);
      }

      // Upload new images if any
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const uploadResult = await uploadImagesMutation.mutateAsync({
          userId,
          listingId: listing.id,
          files,
        });

        if (uploadResult.success) {
          uploadedUrls = [...uploadResult.urls];
        } else {
          setErrors({ submit: uploadResult.error });
          setIsUploading(false);
          return;
        }
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...uploadedUrls];

      // Update listing with all data including images
      const params: UpdateListingParams = {
        title: title.trim(),
        body: body.trim(),
        category,
        imageUrls: allImageUrls.length > 0 ? allImageUrls : undefined,
      };

      const result = await updateMutation.mutateAsync({ id: listing.id, params, userId });

      if (result.success) {
        router.push(`/listings/${listing.id}`);
      } else {
        setErrors({ submit: result.error });
        setIsUploading(false);
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-0">
      <div>
        <label 
          htmlFor="title"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {tCreate('form.title')}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={tCreate('form.titlePlaceholder')}
          className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
          style={{
            border: `1px solid ${errors.title ? 'var(--color-error)' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`;
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
          htmlFor="category"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {tCreate('form.category')}
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
      </div>

      <div>
        <label 
          htmlFor="body"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {tCreate('form.body')}
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={tCreate('form.bodyPlaceholder')}
          rows={10}
          className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors resize-y"
          style={{
            border: `1px solid ${errors.body ? 'var(--color-error)' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`;
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

      <div>
        <ListingImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={5}
          disabled={isUploading || updateMutation.isPending}
        />
      </div>

      {errors.submit && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-error-text)' }}>
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={updateMutation.isPending || isUploading}
          className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={(e) => {
            if (!updateMutation.isPending && !isUploading) {
              e.currentTarget.style.backgroundColor = 'var(--color-border)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending || isUploading}
          className="flex-1 sm:flex-initial px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-text)',
          }}
          onMouseEnter={(e) => {
            if (!updateMutation.isPending && !isUploading) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          {updateMutation.isPending || isUploading ? t('updating') : t('submit')}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { listingsQueries } from '@/services/queries/listings.queries';
import { CATEGORIES } from '@/types/domain/category';
import type { Category } from '@/types/domain/category';
import type { CreateListingParams } from '@/services/features/listings/listings.types';

interface CreateListingFormProps {
  readonly authorId: string;
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

export function CreateListingForm({ authorId }: CreateListingFormProps) {
  const t = useTranslations('listings.create');
  const tCategories = useTranslations('common.categories');
  const tValidation = useTranslations('listings.create.validation');
  const router = useRouter();
  const createMutation = listingsQueries.useCreateListing();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!category) {
      return;
    }

    const params: CreateListingParams = {
      title: title.trim(),
      body: body.trim(),
      category,
    };

    const result = await createMutation.mutateAsync({ params, authorId });

    if (result.success) {
      router.push(`/listings/${result.listing.id}`);
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="title"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('form.title')}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('form.titlePlaceholder')}
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
          {t('form.category')}
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
          htmlFor="body"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('form.body')}
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('form.bodyPlaceholder')}
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

      {errors.submit && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-error-text)' }}>
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-text)',
        }}
        onMouseEnter={(e) => {
          if (!createMutation.isPending) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        }}
      >
        {createMutation.isPending ? t('form.creating') : t('form.submit')}
      </button>
    </form>
  );
}

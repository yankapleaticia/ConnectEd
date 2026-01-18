'use client';

import { useTranslations } from '@/client/lib/i18n';
import { CATEGORIES } from '@/types/domain/category';
import type { Category } from '@/types/domain/category';

interface CategoryFilterProps {
  readonly selectedCategory?: Category;
  readonly onCategoryChange: (category: Category | undefined) => void;
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

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const t = useTranslations('common.categories');
  const tFilters = useTranslations('listings.filters');

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(undefined)}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={
          !selectedCategory
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
          if (selectedCategory) {
            e.currentTarget.style.backgroundColor = 'var(--color-border)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCategory) {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          }
        }}
      >
        {tFilters('allCategories')}
      </button>
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={
              isSelected
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
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--color-border)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }
            }}
          >
            {t(getCategoryLabel(category))}
          </button>
        );
      })}
    </div>
  );
}

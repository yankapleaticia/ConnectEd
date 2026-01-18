'use client';

import { X } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import { SearchBar } from './search-bar';
import { CategoryFilter } from './category-filter';
import { DateFilter } from './date-filter';
import { AuthorFilter } from './author-filter';
import type { Category } from '@/types/domain/category';
import type { ListingsFilters } from '@/services/features/listings/listings.types';

interface FiltersBarProps {
  readonly filters: ListingsFilters;
  readonly onFiltersChange: (filters: ListingsFilters) => void;
}

export function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const t = useTranslations('listings.filters');

  const handleCategoryChange = (category: Category | undefined) => {
    onFiltersChange({ ...filters, category });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const handleSortChange = (sortBy: 'newest' | 'oldest') => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleAuthorChange = (authorId: string | undefined) => {
    onFiltersChange({ ...filters, authorId: authorId || undefined });
  };

  const hasActiveFilters = filters.category || filters.search || filters.authorId || filters.sortBy === 'oldest';

  const clearFilters = () => {
    onFiltersChange({ sortBy: 'newest' });
  };

  return (
    <div className="space-y-4 mb-6 py-4 sm:py-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        <DateFilter
          sortBy={filters.sortBy || 'newest'}
          onSortChange={handleSortChange}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <CategoryFilter
          selectedCategory={filters.category}
          onCategoryChange={handleCategoryChange}
        />
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            }}
          >
            <X size={16} />
            {t('clear')}
          </button>
        )}
      </div>
      {filters.authorId && (
        <AuthorFilter
          authorId={filters.authorId}
          onAuthorChange={handleAuthorChange}
        />
      )}
    </div>
  );
}

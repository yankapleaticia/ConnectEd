'use client';

import { useTranslations } from '@/client/lib/i18n';

type SortOption = 'newest' | 'oldest';

interface DateFilterProps {
  readonly sortBy: SortOption;
  readonly onSortChange: (sort: SortOption) => void;
}

export function DateFilter({ sortBy, onSortChange }: DateFilterProps) {
  const t = useTranslations('listings.filters');

  return (
    <div className="flex items-center gap-2">
      <label 
        className="text-sm font-medium"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {t('sort')}:
      </label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-3 py-2 rounded-lg focus:outline-none transition-colors text-sm font-medium"
        style={{
          border: `1px solid var(--color-border)`,
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-secondary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <option value="newest" style={{ color: 'var(--color-text-secondary)' }}>{t('newest')}</option>
        <option value="oldest" style={{ color: 'var(--color-text-secondary)' }}>{t('oldest')}</option>
      </select>
    </div>
  );
}

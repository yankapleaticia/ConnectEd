'use client';

import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { FileText } from 'lucide-react';

interface EmptyListingsStateProps {
  readonly hasFilters?: boolean;
}

export function EmptyListingsState({ hasFilters }: EmptyListingsStateProps) {
  const t = useTranslations('listings.empty');
  const tFilters = useTranslations('listings.filters');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <FileText
          size={40}
          className="sm:w-12 sm:h-12"
          style={{ color: 'var(--color-text-muted)' }}
        />
      </div>
      <h3
        className="text-xl sm:text-2xl font-bold mb-2 text-center"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {hasFilters ? tFilters('noResults') : t('title')}
      </h3>
      <p
        className="text-sm sm:text-base text-center max-w-md mb-6"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {hasFilters
          ? 'Try adjusting your filters to see more results.'
          : t('description')}
      </p>
      {isAuthenticated && !hasFilters && (
        <p
          className="text-sm text-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {t('createFirst')}
        </p>
      )}
    </div>
  );
}

'use client';

import { useTranslations } from '@/client/lib/i18n';

interface AuthorFilterProps {
  readonly authorId?: string;
  readonly onAuthorChange: (authorId: string | undefined) => void;
}

export function AuthorFilter({ authorId, onAuthorChange }: AuthorFilterProps) {
  const t = useTranslations('listings.filters');

  if (!authorId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('author')}:</span>
      <span className="text-sm font-medium text-gray-900">{authorId}</span>
      <button
        onClick={() => onAuthorChange(undefined)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        ×
      </button>
    </div>
  );
}

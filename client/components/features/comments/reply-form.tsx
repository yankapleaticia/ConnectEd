'use client';

import { useState } from 'react';
import { useTranslations } from '@/client/lib/i18n';
import { commentsQueries } from '@/services/queries/comments.queries';
import type { CreateCommentParams } from '@/services/features/comments/comments.types';

interface ReplyFormProps {
  readonly listingId: string;
  readonly authorId: string;
  readonly parentCommentId: string;
  readonly onCancel: () => void;
  readonly onSuccess?: () => void;
}

export function ReplyForm({ listingId, authorId, parentCommentId, onCancel, onSuccess }: ReplyFormProps) {
  const t = useTranslations('comments');
  const createMutation = commentsQueries.useCreateComment();

  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!content.trim()) {
      newErrors.content = t('validation.contentRequired');
    } else if (content.trim().length < 5) {
      newErrors.content = t('validation.contentMin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const params: CreateCommentParams = {
      content: content.trim(),
      parentCommentId,
    };

    const result = await createMutation.mutateAsync({ params, listingId, authorId });

    if (result.success) {
      setContent('');
      setErrors({});
      onSuccess?.();
      onCancel();
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('replyPlaceholder')}
          rows={2}
          autoFocus
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors resize-y"
          style={{
            border: `1px solid ${errors.content ? 'var(--color-error)' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.content ? 'var(--color-error)' : 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {errors.content && (
          <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>
            {errors.content}
          </p>
        )}
      </div>

      {errors.submit && (
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-error-text)' }}>
          <p className="text-xs">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {createMutation.isPending ? t('submitting') : t('reply')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={createMutation.isPending}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

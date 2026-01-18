'use client';

import { useState } from 'react';
import { useTranslations } from '@/client/lib/i18n';
import { commentsQueries } from '@/services/queries/comments.queries';
import type { Comment } from '@/types/domain/comment';
import type { UpdateCommentParams } from '@/services/features/comments/comments.types';

interface EditCommentFormProps {
  readonly comment: Comment;
  readonly userId: string;
  readonly onCancel: () => void;
}

export function EditCommentForm({ comment, userId, onCancel }: EditCommentFormProps) {
  const t = useTranslations('comments');
  const updateMutation = commentsQueries.useUpdateComment();

  const [content, setContent] = useState(comment.content);
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

    const params: UpdateCommentParams = {
      content: content.trim(),
    };

    const result = await updateMutation.mutateAsync({ id: comment.id, params, userId });

    if (result.success) {
      onCancel();
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors resize-y"
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
        <p className="text-sm" style={{ color: 'var(--color-error)' }}>
          {errors.content}
        </p>
      )}
      {errors.submit && (
        <p className="text-sm" style={{ color: 'var(--color-error)' }}>
          {errors.submit}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-3 py-1 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-text)',
          }}
          onMouseEnter={(e) => {
            if (!updateMutation.isPending) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          {updateMutation.isPending ? t('updating') : t('save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={updateMutation.isPending}
          className="px-3 py-1 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={(e) => {
            if (!updateMutation.isPending) {
              e.currentTarget.style.backgroundColor = 'var(--color-border)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          }}
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

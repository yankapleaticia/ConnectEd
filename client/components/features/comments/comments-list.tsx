'use client';

import { useTranslations } from '@/client/lib/i18n';
import { commentsQueries } from '@/services/queries/comments.queries';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';
import { useAuthStore } from '@/store/features/auth.store';

interface CommentsListProps {
  readonly listingId: string;
}

export function CommentsList({ listingId }: CommentsListProps) {
  const t = useTranslations('comments');
  const user = useAuthStore((state) => state.user);
  const { data: comments, isLoading, error } = commentsQueries.useComments(listingId, user?.id);

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 
          className="text-2xl font-semibold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 
          className="text-2xl font-semibold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h2>
        <p style={{ color: 'var(--color-error)' }}>Error loading comments</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {t('title')}
      </h2>

      {user && (
        <div className="mb-6">
          <CommentForm listingId={listingId} authorId={user.id} />
        </div>
      )}

      {!comments || comments.length === 0 ? (
        <div className="py-8 text-center">
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

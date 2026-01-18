'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { commentsQueries } from '@/services/queries/comments.queries';
import { EditCommentForm } from './edit-comment-form';
import { ReactionPicker } from './reaction-picker';
import { ReplyForm } from './reply-form';
import type { Comment } from '@/types/domain/comment';

interface CommentItemProps {
  readonly comment: Comment;
  readonly depth?: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const t = useTranslations('comments');
  const user = useAuthStore((state) => state.user);
  const { data: authorProfile } = profileQueries.useProfile(comment.authorId);
  const deleteMutation = commentsQueries.useDeleteComment();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const canEdit = user && user.id === comment.authorId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 5; // Maximum nesting level

  const authorName = authorProfile?.success
    ? `${authorProfile.profile.firstName} ${authorProfile.profile.lastName}`
    : comment.authorId;
  
  const avatarUrl = authorProfile?.success ? authorProfile.profile.avatarUrl : null;
  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  const handleDelete = async () => {
    if (!user) return;

    const result = await deleteMutation.mutateAsync({
      id: comment.id,
      userId: user.id,
      listingId: comment.listingId,
    });

    if (result.success) {
      setShowDeleteConfirm(false);
    }
  };

  if (isEditing && user) {
    return (
      <div 
        className="p-4 rounded-lg"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: `1px solid var(--color-border)`,
        }}
      >
        <EditCommentForm
          comment={comment}
          userId={user.id}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <div 
        className="p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: `1px solid var(--color-border)`,
          marginLeft: depth > 0 ? `${depth * 20}px` : '0',
          borderLeft: depth > 0 ? '3px solid var(--color-primary-light)' : undefined,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
              {displayUrl ? (
                isDataUrl || isExternalUrl ? (
                  <img
                    src={displayUrl}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={displayUrl}
                    alt={authorName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 32px, 40px"
                  />
                )
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <span
                    className="text-xs sm:text-sm font-semibold"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {authorName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p 
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {authorName}
              </p>
              <p 
                className="text-xs mt-0.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>
          {canEdit && !showDeleteConfirm && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm transition-colors"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              >
                {t('edit')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm transition-colors"
                style={{ color: 'var(--color-error)' }}
              >
                {t('delete')}
              </button>
            </div>
          )}
        </div>

        {showDeleteConfirm ? (
          <div className="space-y-3">
            <p style={{ color: 'var(--color-text-secondary)' }}>{t('deleteConfirm')}</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-3 py-1 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-error-text)',
                }}
              >
                {t('delete')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
                className="px-3 py-1 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p 
              className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {comment.content}
            </p>

            {/* Action buttons: Reactions and Reply */}
            <div className="flex items-center gap-3 flex-wrap">
              <ReactionPicker
                commentId={comment.id}
                listingId={comment.listingId}
                reactionCounts={comment.reactionCounts}
                userReaction={comment.userReaction}
              />

              {user && depth < maxDepth && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {t('reply')}
                </button>
              )}

              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>{comment.replies!.length} {comment.replies!.length === 1 ? t('replyCount') : t('repliesCount')}</span>
                </button>
              )}
            </div>

            {/* Reply form */}
            {showReplyForm && user && (
              <ReplyForm
                listingId={comment.listingId}
                authorId={user.id}
                parentCommentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                onSuccess={() => setShowReplies(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Nested replies */}
      {hasReplies && showReplies && (
        <div className="mt-3 space-y-3">
          {comment.replies!.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

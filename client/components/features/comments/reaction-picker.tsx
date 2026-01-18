'use client';

import { useState } from 'react';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { commentsQueries } from '@/services/queries/comments.queries';
import type { ReactionType, ReactionCounts } from '@/types/domain/comment';

interface ReactionPickerProps {
  readonly commentId: string;
  readonly listingId: string;
  readonly reactionCounts?: ReactionCounts;
  readonly userReaction?: ReactionType | null;
}

const REACTIONS: readonly { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
];

export function ReactionPicker({ commentId, listingId, reactionCounts, userReaction }: ReactionPickerProps) {
  const t = useTranslations('comments');
  const user = useAuthStore((state) => state.user);
  const addReactionMutation = commentsQueries.useAddReaction();
  const removeReactionMutation = commentsQueries.useRemoveReaction();
  
  const [showPicker, setShowPicker] = useState(false);

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (!user) return;

    // If user clicks the same reaction, remove it
    if (userReaction === reactionType) {
      await removeReactionMutation.mutateAsync({
        commentId,
        userId: user.id,
        listingId,
      });
    } else {
      // Add or change reaction
      await addReactionMutation.mutateAsync({
        commentId,
        userId: user.id,
        reactionType,
        listingId,
      });
    }

    setShowPicker(false);
  };

  const totalReactions = reactionCounts?.total || 0;
  const userReactionEmoji = userReaction 
    ? REACTIONS.find((r) => r.type === userReaction)?.emoji 
    : null;

  return (
    <div className="relative inline-block">
      {/* Main reaction button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (!user) return;
            if (userReaction) {
              // If user has already reacted, toggle picker
              setShowPicker(!showPicker);
            } else {
              // Quick like if no reaction yet
              handleReactionClick('like');
            }
          }}
          onMouseEnter={() => user && setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
          disabled={!user || addReactionMutation.isPending || removeReactionMutation.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          style={{
            backgroundColor: userReaction ? 'var(--color-primary-light)' : 'var(--color-surface)',
            color: userReaction ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            border: `1px solid ${userReaction ? 'var(--color-primary)' : 'var(--color-border)'}`,
          }}
        >
          <span className="text-base">{userReactionEmoji || '👍'}</span>
          <span>{totalReactions > 0 ? totalReactions : t('react')}</span>
        </button>

        {/* Reaction picker popup */}
        {showPicker && user && (
          <div
            onMouseEnter={() => setShowPicker(true)}
            onMouseLeave={() => setShowPicker(false)}
            className="absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg z-10 flex gap-1"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              animation: 'fadeIn 0.2s ease-in-out',
            }}
          >
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReactionClick(reaction.type)}
                className="p-2 rounded-lg transition-transform hover:scale-125 relative group"
                style={{
                  backgroundColor: userReaction === reaction.type ? 'var(--color-primary-light)' : 'transparent',
                }}
                title={reaction.label}
              >
                <span className="text-2xl">{reaction.emoji}</span>
                
                {/* Tooltip */}
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: 'var(--color-surface-dark)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {reaction.label}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reaction counts breakdown (optional tooltip) */}
      {totalReactions > 0 && reactionCounts && (
        <div className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {REACTIONS.filter((r) => (reactionCounts[r.type] || 0) > 0).map((r) => (
            <span key={r.type} className="mr-2">
              {r.emoji} {reactionCounts[r.type]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

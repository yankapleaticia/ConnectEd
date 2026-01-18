'use client';

import Link from 'next/link';
import Image from 'next/image';
import { profileQueries } from '@/services/queries/profile.queries';
import type { Conversation } from '@/services/features/messages/messages.types';

interface ConversationItemProps {
  readonly conversation: Conversation;
  readonly currentUserId: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function ConversationItem({ conversation, currentUserId }: ConversationItemProps) {
  const { data: otherUserProfile } = profileQueries.useProfile(conversation.userId);
  const lastMessage = conversation.lastMessage;
  const preview = lastMessage?.body ?? '';
  const previewText = preview.length > 60 ? `${preview.substring(0, 60)}...` : preview;

  const displayName = otherUserProfile?.success
    ? `${otherUserProfile.profile.firstName} ${otherUserProfile.profile.lastName}`
    : conversation.userId;

  const avatarUrl = otherUserProfile?.success ? otherUserProfile.profile.avatarUrl : null;
  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  return (
    <Link
      href={`/messages/${conversation.userId}`}
      className="block p-4 rounded-lg transition-colors hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid var(--color-border)`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border flex-shrink-0" 
             style={{ borderColor: 'var(--color-border)' }}>
          {displayUrl ? (
            isDataUrl || isExternalUrl ? (
              <img
                src={displayUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={displayUrl}
                alt={displayName}
                fill
                className="object-cover"
                sizes="48px"
              />
            )
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <span
                className="text-lg font-semibold"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {displayName[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p
              className="font-medium truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {displayName}
            </p>
            {lastMessage && (
              <p
                className="text-xs ml-2 flex-shrink-0"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {formatDate(lastMessage.createdAt)}
              </p>
            )}
          </div>
          {lastMessage && (
            <p
              className="text-sm truncate mt-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {previewText}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

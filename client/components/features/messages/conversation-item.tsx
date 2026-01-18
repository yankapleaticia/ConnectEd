'use client';

import Link from 'next/link';
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
  const lastMessage = conversation.lastMessage;
  const preview = lastMessage?.body ?? '';
  const previewText = preview.length > 60 ? `${preview.substring(0, 60)}...` : preview;

  return (
    <Link
      href={`/messages/${conversation.userId}`}
      className="block p-4 rounded-lg transition-colors hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid var(--color-border)`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p
            className="font-medium truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {conversation.userId}
          </p>
          {lastMessage && (
            <p
              className="text-sm truncate mt-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {previewText}
            </p>
          )}
        </div>
        {lastMessage && (
          <p
            className="text-xs ml-2 flex-shrink-0"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {formatDate(lastMessage.createdAt)}
          </p>
        )}
      </div>
    </Link>
  );
}

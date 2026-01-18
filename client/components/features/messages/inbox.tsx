'use client';

import { useTranslations } from '@/client/lib/i18n';
import { messagesQueries } from '@/services/queries/messages.queries';
import { ConversationItem } from './conversation-item';

interface InboxProps {
  readonly userId: string;
}

export function Inbox({ userId }: InboxProps) {
  const t = useTranslations('messages');
  const { data: conversations, isLoading, error } = messagesQueries.useConversations(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-error)' }}>Error loading conversations</p>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('noConversations')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.userId}
          conversation={conversation}
          currentUserId={userId}
        />
      ))}
    </div>
  );
}

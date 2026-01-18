'use client';

import { useTranslations } from '@/client/lib/i18n';
import { messagesQueries } from '@/services/queries/messages.queries';
import { MessageForm } from './message-form';
import { MessageBubble } from './message-bubble';
import type { Message } from '@/types/domain/message';

interface ConversationViewProps {
  readonly currentUserId: string;
  readonly otherUserId: string;
}

export function ConversationView({ currentUserId, otherUserId }: ConversationViewProps) {
  const t = useTranslations('messages');
  const { data: messages, isLoading, error } = messagesQueries.useMessages(currentUserId, otherUserId);

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
        <p style={{ color: 'var(--color-error)' }}>Error loading messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4">
        {!messages || messages.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p style={{ color: 'var(--color-text-secondary)' }}>{t('noMessages')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={message.senderId === currentUserId}
              />
            ))}
          </div>
        )}
      </div>
      <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
        <MessageForm receiverId={otherUserId} senderId={currentUserId} />
      </div>
    </div>
  );
}

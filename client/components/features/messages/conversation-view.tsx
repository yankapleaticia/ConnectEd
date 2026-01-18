'use client';

import { useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-full rounded-lg overflow-hidden border" 
         style={{ 
           backgroundColor: 'var(--color-background)',
           borderColor: 'var(--color-border)'
         }}>
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4" 
           style={{ scrollBehavior: 'smooth' }}>
        {!messages || messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed message form at bottom */}
      <div className="border-t px-4 py-3" 
           style={{ 
             borderColor: 'var(--color-border)',
             backgroundColor: 'var(--color-surface)'
           }}>
        <MessageForm receiverId={otherUserId} senderId={currentUserId} />
      </div>
    </div>
  );
}

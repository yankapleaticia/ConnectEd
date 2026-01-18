'use client';

import type { Message } from '@/types/domain/message';

interface MessageBubbleProps {
  readonly message: Message;
  readonly isSent: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function MessageBubble({ message, isSent }: MessageBubbleProps) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isSent ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={
          isSent
            ? {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-text)',
              }
            : {
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: `1px solid var(--color-border)`,
              }
        }
      >
        <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
          {message.body}
        </p>
        <p
          className={`text-xs mt-1.5 ${
            isSent ? 'text-right' : 'text-left'
          }`}
          style={{
            opacity: 0.7,
          }}
        >
          {formatDate(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

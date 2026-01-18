'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import { messagesQueries } from '@/services/queries/messages.queries';
import type { CreateMessageParams } from '@/services/features/messages/messages.types';

interface MessageFormProps {
  readonly receiverId: string;
  readonly senderId: string;
}

export function MessageForm({ receiverId, senderId }: MessageFormProps) {
  const t = useTranslations('messages');
  const createMutation = messagesQueries.useCreateMessage();

  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!body.trim()) {
      newErrors.body = t('validation.bodyRequired');
    } else if (body.trim().length < 1) {
      newErrors.body = t('validation.bodyMin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const params: CreateMessageParams = {
      body: body.trim(),
      receiverId,
    };

    const result = await createMutation.mutateAsync({ params, senderId });

    if (result.success) {
      setBody('');
      setErrors({});
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.submit && (
        <div className="mb-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-error-text)' }}>
          <p className="text-xs">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('bodyPlaceholder')}
          rows={1}
          className="flex-1 px-4 py-2 rounded-lg focus:outline-none transition-colors resize-none min-h-[44px] max-h-32 overflow-y-auto"
          style={{
            border: `1px solid ${errors.body ? 'var(--color-error)' : 'var(--color-border)'}`,
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.body ? 'var(--color-error)' : 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          disabled={!body.trim() || createMutation.isPending}
          className="p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-text)',
          }}
          onMouseEnter={(e) => {
            if (body.trim() && !createMutation.isPending) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}

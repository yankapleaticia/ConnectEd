'use client';

import { useState } from 'react';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('bodyPlaceholder')}
          rows={3}
          className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors resize-y"
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
        {errors.body && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
            {errors.body}
          </p>
        )}
      </div>

      {errors.submit && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-error-text)' }}>
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-text)',
        }}
        onMouseEnter={(e) => {
          if (!createMutation.isPending) {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        }}
      >
        {createMutation.isPending ? t('sending') : t('send')}
      </button>
    </form>
  );
}

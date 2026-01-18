'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { ConversationView } from '@/client/components/features/messages/conversation-view';

export default function ConversationPage() {
  const t = useTranslations('messages');
  const router = useRouter();
  const params = useParams();
  const otherUserId = params.userId as string;

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('conversationWith')} {otherUserId}
        </h1>
      </div>
      <div className="min-h-[500px]" style={{ backgroundColor: 'var(--color-background)' }}>
        <ConversationView currentUserId={user.id} otherUserId={otherUserId} />
      </div>
    </div>
  );
}

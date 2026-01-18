'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { ConversationView } from '@/client/components/features/messages/conversation-view';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('messages');
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const otherUserId = params.userId as string;
  const { data: otherUserProfile } = profileQueries.useProfile(otherUserId);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center py-12 px-4 sm:px-6">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  const otherUserName = otherUserProfile?.success
    ? `${otherUserProfile.profile.firstName} ${otherUserProfile.profile.lastName}`
    : otherUserId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b flex-shrink-0" 
           style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => router.push('/messages')}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold" 
            style={{ color: 'var(--color-text-primary)' }}>
          {otherUserName}
        </h1>
      </div>
      <div className="flex-1 min-h-0">
        <ConversationView currentUserId={user.id} otherUserId={otherUserId} />
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { CreateListingForm } from '@/client/components/features/listings/create-listing-form';

export default function CreateListingPage() {
  const t = useTranslations('listings.create');
  const router = useRouter();
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h1>
        <p 
          className="text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {t('subtitle')}
        </p>
      </div>
      <CreateListingForm authorId={user.id} />
    </div>
  );
}

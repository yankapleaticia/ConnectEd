'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { EditProfileForm } from '@/client/components/features/profile/edit-profile-form';
import { useTranslations } from '@/client/lib/i18n';

function EditProfileContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isLoading);
  const { data: profileData, isLoading: profileLoading } = profileQueries.useProfile(user?.id ?? null);
  const t = useTranslations('profile.edit');

  useEffect(() => {
    // IMPORTANT:
    // Don't decide auth redirects until Supabase session has been re-hydrated.
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!profileLoading) {
      if (!profileData?.success || !profileData.profile.profileCompleted) {
        // Profile not complete - redirect to completion page
        router.replace('/profile/complete');
      }
    }
  }, [authLoading, user, profileData, profileLoading, router]);

  // Show loading state
  if (authLoading || !user || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  // If profile is not completed, don't render (redirect will happen)
  if (!profileData?.success || !profileData.profile.profileCompleted) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h1>
      </div>
      <EditProfileForm userId={user.id} profile={profileData.profile} />
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    }>
      <EditProfileContent />
    </Suspense>
  );
}

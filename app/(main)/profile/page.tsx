'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { ProfileView } from '@/client/components/features/profile/profile-view';
import { useTranslations } from '@/client/lib/i18n';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isLoading);
  const { data: profileData, isLoading: profileLoading } = profileQueries.useProfile(user?.id ?? null);
  const t = useTranslations('profile.view');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check for success query param
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        // Remove query param from URL
        router.replace('/profile', { scroll: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

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
        <p className="text-[color:var(--color-text-secondary)]">Loading...</p>
      </div>
    );
  }

  // If profile is not completed, don't render (redirect will happen)
  if (!profileData?.success || !profileData.profile.profileCompleted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Success Notification */}
      {showSuccess && (
        <div 
          className="mx-4 mt-4 sm:mx-auto sm:max-w-4xl rounded-lg p-4 mb-4 flex items-center justify-between"
          style={{
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-success-text)',
          }}
        >
          <p className="text-sm sm:text-base font-medium">{t('success')}</p>
          <button
            onClick={() => {
              setShowSuccess(false);
              router.replace('/profile', { scroll: false });
            }}
            className="ml-4 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      )}

      {/* Profile View */}
      <ProfileView profile={profileData.profile} userId={user.id} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-[color:var(--color-text-secondary)]">Loading...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

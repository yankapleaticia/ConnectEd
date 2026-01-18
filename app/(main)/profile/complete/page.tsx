'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { ProfileCompletionForm } from '@/client/components/features/profile/profile-completion-form';
import { AuthCard } from '@/client/components/features/auth/auth-card';

export default function ProfileCompletePage() {
  const t = useTranslations('profile.complete');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isLoading);
  const { data: profileData, isLoading: profileLoading } = profileQueries.useProfile(user?.id ?? null);

  useEffect(() => {
    // IMPORTANT:
    // Don't decide auth redirects until Supabase session has been re-hydrated.
    if (authLoading) return;

    // Redirect if not authenticated
    if (!user) {
      router.replace('/login');
      return;
    }

    // If profile exists and is completed, redirect to listings
    if (!profileLoading && profileData?.success && profileData.profile.profileCompleted) {
      router.replace('/listings');
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

  // If profile is already completed, don't render form (redirect will happen)
  if (profileData?.success && profileData.profile.profileCompleted) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <AuthCard title={t('title')} subtitle={t('subtitle')}>
        <ProfileCompletionForm userId={user.id} />
      </AuthCard>
    </div>
  );
}

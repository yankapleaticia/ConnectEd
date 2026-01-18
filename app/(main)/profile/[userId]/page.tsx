'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { PublicProfileView } from '@/client/components/features/profile/public-profile-view';

export default function PublicProfilePage() {
  const params = useParams();
  const t = useTranslations('profile.public');
  const user = useAuthStore((state) => state.user);
  const userId = params.userId as string;
  const { data: profileData, isLoading, error } = profileQueries.useProfile(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4 sm:px-6">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (error || !profileData?.success) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4 sm:px-6">
        <p style={{ color: 'var(--color-error)' }}>
          {profileData?.success === false 
            ? profileData.error 
            : 'Profile not found'}
        </p>
      </div>
    );
  }

  if (!profileData.profile.profileCompleted) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4 sm:px-6">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          This profile is not yet completed.
        </p>
      </div>
    );
  }

  return (
    <PublicProfileView 
      profile={profileData.profile} 
      userId={userId}
      currentUserId={user?.id ?? null}
    />
  );
}

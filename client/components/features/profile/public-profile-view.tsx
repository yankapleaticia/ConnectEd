'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import { ProfileListingsFeed } from './profile-listings-feed';
import type { Profile } from '@/types/domain/user';

interface PublicProfileViewProps {
  readonly profile: Profile;
  readonly userId: string;
  readonly currentUserId: string | null;
}

export function PublicProfileView({ profile, userId, currentUserId }: PublicProfileViewProps) {
  const t = useTranslations('profile.public');
  const tView = useTranslations('profile.view');
  const router = useRouter();
  
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const location = [profile.locationCity, profile.locationCountry]
    .filter(Boolean)
    .join(', ') || null;
  const languages = profile.languages.length > 0 
    ? profile.languages.join(', ')
    : null;
  const displayUrl = profile.avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  const canMessage = currentUserId && currentUserId !== userId;
  const messageLabel = `${t('message')} ${fullName}`;

  const handleMessageClick = () => {
    router.push(`/messages/${userId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Profile Header Card */}
      <div 
        className="rounded-xl border p-6 sm:p-8 shadow-sm"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2" style={{ borderColor: 'var(--color-border)' }}>
              {displayUrl ? (
                isDataUrl || isExternalUrl ? (
                  <img
                    src={displayUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={displayUrl}
                    alt={fullName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                )
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <span 
                    className="text-2xl sm:text-3xl font-semibold"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {profile.firstName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h1 
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {fullName}
                </h1>
                {profile.bio && (
                  <p 
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Message Button */}
              {canMessage && (
                <button
                  onClick={handleMessageClick}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm self-start flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-text)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  aria-label={messageLabel}
                >
                  <MessageSquare size={18} />
                  {t('message')}
                </button>
              )}
            </div>

            <div className="space-y-2 sm:space-y-3">
              {location && (
                <div className="flex items-start gap-2">
                  <span 
                    className="text-sm sm:text-base font-medium min-w-[80px] sm:min-w-[100px]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {tView('location')}:
                  </span>
                  <span 
                    className="text-sm sm:text-base"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {location}
                  </span>
                </div>
              )}

              {languages && (
                <div className="flex items-start gap-2">
                  <span 
                    className="text-sm sm:text-base font-medium min-w-[80px] sm:min-w-[100px]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {tView('languages')}:
                  </span>
                  <span 
                    className="text-sm sm:text-base"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {languages}
                  </span>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-start gap-2">
                  <span 
                    className="text-sm sm:text-base font-medium min-w-[80px] sm:min-w-[100px]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {tView('phone')}:
                  </span>
                  <span 
                    className="text-sm sm:text-base"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {profile.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div>
        <h2 
          className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {tView('listings')}
        </h2>
        <ProfileListingsFeed userId={userId} />
      </div>
    </div>
  );
}

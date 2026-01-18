'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/client/lib/i18n';
import Link from 'next/link';
import { useAuthStore } from '@/store/features/auth.store';
import { useLocaleStore } from '@/store/features/locale.store';
import { profileQueries } from '@/services/queries/profile.queries';
import { List, MessageSquare, User, LogOut, Globe, Check } from 'lucide-react';

export function Header() {
  const t = useTranslations('common.nav');
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const initializeLocale = useLocaleStore((state) => state.initialize);
  const { data: profileData } = profileQueries.useProfile(user?.id ?? null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize locale on mount
  useEffect(() => {
    initializeLocale();
  }, [initializeLocale]);

  const profile = profileData?.success ? profileData.profile : null;
  const avatarUrl = profile?.avatarUrl;
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email ?? 'User';

  const displayUrl = avatarUrl;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header 
      className="border-b sticky top-0 z-50"
      style={{ 
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-border)'
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="ConnectEd"
                width={300}
                height={90}
                priority
                className="h-26 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* All Listings - Always visible, Desktop: icon + text, Mobile: icon + text */}
            <Link
              href="/listings"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors rounded-lg"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <List size={18} />
              <span className="whitespace-nowrap">{t('feed')}</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Messages - Desktop: icon + text, Mobile: icon only */}
                <Link
                  href="/messages"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <MessageSquare size={18} />
                  <span className="hidden sm:inline">{t('messages')}</span>
                </Link>

                {/* Profile - Desktop: icon + text, Mobile: avatar with dropdown */}
                <div className="relative" ref={menuRef}>
                  {/* Desktop: Icon + Text */}
                  <Link
                    href="/profile"
                    className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <User size={18} />
                    <span>{t('profile')}</span>
                  </Link>

                  {/* Mobile: Avatar Button */}
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="md:hidden relative w-10 h-10 rounded-full overflow-hidden border transition-colors"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {displayUrl ? (
                      isDataUrl || isExternalUrl ? (
                        <img
                          src={displayUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={displayUrl}
                          alt={displayName}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-surface)' }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {displayName[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Mobile Dropdown Menu */}
                  {showProfileMenu && (
                    <div
                      className="md:hidden absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                          style={{ color: 'var(--color-text-secondary)' }}
                          onClick={() => setShowProfileMenu(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-primary-text)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                          }}
                        >
                          <User size={16} />
                          {t('profile')}
                        </Link>
                        
                        {/* Language Divider */}
                        <div
                          className="my-1"
                          style={{ borderTop: '1px solid var(--color-border)' }}
                        />

                        {/* Language Section */}
                        <div className="px-4 py-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe size={14} style={{ color: 'var(--color-text-muted)' }} />
                            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                              {t('language')}
                            </span>
                          </div>
                        </div>
                        
                        {/* English Option */}
                        <button
                          onClick={() => {
                            setLocale('en');
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors w-full"
                          style={{ color: 'var(--color-text-secondary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span>{t('english')}</span>
                          {locale === 'en' && <Check size={16} style={{ color: 'var(--color-primary)' }} />}
                        </button>
                        
                        {/* French Option */}
                        <button
                          onClick={() => {
                            setLocale('fr');
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors w-full"
                          style={{ color: 'var(--color-text-secondary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span>{t('french')}</span>
                          {locale === 'fr' && <Check size={16} style={{ color: 'var(--color-primary)' }} />}
                        </button>

                        {/* Logout Divider */}
                        <div
                          className="my-1"
                          style={{ borderTop: '1px solid var(--color-border)' }}
                        />

                        <Link
                          href="/logout"
                          className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                          style={{ color: 'var(--color-error)' }}
                          onClick={() => setShowProfileMenu(false)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-error)';
                            e.currentTarget.style.color = 'var(--color-error-text)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-error)';
                          }}
                        >
                          <LogOut size={16} />
                          {t('logout')}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Logout */}
                <Link
                  href="/logout"
                  className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                  style={{ color: 'var(--color-error)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut size={18} />
                  <span>{t('logout')}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary-text)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

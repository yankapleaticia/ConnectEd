'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { profileQueries } from '@/services/queries/profile.queries';
import { AvatarUpload } from './avatar-upload';
import type { UpdateProfileParams } from '@/services/features/profile/profile.types';
import type { Profile } from '@/types/domain/user';

interface EditProfileFormProps {
  readonly userId: string;
  readonly profile: Profile;
}

export function EditProfileForm({ userId, profile }: EditProfileFormProps) {
  const t = useTranslations('profile.complete.form');
  const tValidation = useTranslations('profile.complete.validation');
  const tEdit = useTranslations('profile.edit');
  const router = useRouter();
  const updateMutation = profileQueries.useUpdateProfile();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [locationCity, setLocationCity] = useState(profile.locationCity ?? '');
  const [locationCountry, setLocationCountry] = useState(profile.locationCountry ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [languages, setLanguages] = useState(profile.languages.join(', '));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when profile changes
  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setBio(profile.bio ?? '');
    setLocationCity(profile.locationCity ?? '');
    setLocationCountry(profile.locationCountry ?? '');
    setPhone(profile.phone ?? '');
    setLanguages(profile.languages.join(', '));
    setAvatarUrl(profile.avatarUrl);
  }, [profile]);

  const errorsMemo = useMemo(() => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = tValidation('firstNameRequired');
    if (!lastName.trim()) next.lastName = tValidation('lastNameRequired');
    if (bio.trim().length > 500) next.bio = tValidation('bioMax');
    return next;
  }, [firstName, lastName, bio, tValidation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (Object.keys(errorsMemo).length > 0) {
      setErrors(errorsMemo);
      return;
    }

    const languagesArray = languages
      .split(',')
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0);

    const params: UpdateProfileParams = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bio: bio.trim() || undefined,
      locationCity: locationCity.trim() || undefined,
      locationCountry: locationCountry.trim() || undefined,
      phone: phone.trim() || undefined,
      languages: languagesArray.length > 0 ? languagesArray : undefined,
      avatarUrl: avatarUrl || undefined,
    };

    const result = await updateMutation.mutateAsync({ userId, params });

    if (result.success) {
      router.push('/profile?success=true');
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="w-full flex justify-center">
        <AvatarUpload
          userId={userId}
          currentAvatarUrl={profile.avatarUrl}
          onUploadComplete={(url) => setAvatarUrl(url)}
          onError={(error) => setErrors({ avatar: error })}
        />
      </div>
      {errors.avatar && (
        <p className="text-sm text-[color:var(--color-error)] text-center">{errors.avatar}</p>
      )}

      {/* First Name and Last Name - Side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
          >
            {t('firstNameLabel')}
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('firstNamePlaceholder')}
            className={[
              'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
              errors.firstName
                ? 'border-[color:var(--color-error)]'
                : 'border-[color:var(--color-border)]',
            ].join(' ')}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-[color:var(--color-error)]">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
          >
            {t('lastNameLabel')}
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('lastNamePlaceholder')}
            className={[
              'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
              errors.lastName
                ? 'border-[color:var(--color-error)]'
                : 'border-[color:var(--color-border)]',
            ].join(' ')}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-[color:var(--color-error)]">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
        >
          {t('bioLabel')}
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t('bioPlaceholder')}
          rows={4}
          maxLength={500}
          className={[
            'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)] resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
            errors.bio ? 'border-[color:var(--color-error)]' : 'border-[color:var(--color-border)]',
          ].join(' ')}
        />
        <div className="mt-1 flex justify-between">
          {errors.bio ? (
            <p className="text-sm text-[color:var(--color-error)]">{errors.bio}</p>
          ) : (
            <div />
          )}
          <p className="text-xs text-[color:var(--color-text-muted)]">
            {bio.length}/500
          </p>
        </div>
      </div>

      {/* Location - City and Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="locationCity"
            className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
          >
            {t('locationCityLabel')}
          </label>
          <input
            id="locationCity"
            type="text"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            placeholder={t('locationCityPlaceholder')}
            className={[
              'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
              'border-[color:var(--color-border)]',
            ].join(' ')}
          />
        </div>

        <div>
          <label
            htmlFor="locationCountry"
            className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
          >
            {t('locationCountryLabel')}
          </label>
          <input
            id="locationCountry"
            type="text"
            value={locationCountry}
            onChange={(e) => setLocationCountry(e.target.value)}
            placeholder={t('locationCountryPlaceholder')}
            className={[
              'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
              'border-[color:var(--color-border)]',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
        >
          {t('phoneLabel')}
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('phonePlaceholder')}
          className={[
            'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
            'border-[color:var(--color-border)]',
          ].join(' ')}
        />
      </div>

      {/* Languages */}
      <div>
        <label
          htmlFor="languages"
          className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]"
        >
          {t('languagesLabel')}
        </label>
        <input
          id="languages"
          type="text"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder={t('languagesPlaceholder')}
          className={[
            'w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2.5 text-[color:var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
            'border-[color:var(--color-border)]',
          ].join(' ')}
        />
        <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
          {t('languagesHint')}
        </p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="rounded-lg border p-3 border-[color:var(--color-error)] bg-[color:var(--color-error)] text-[color:var(--color-error-text)]">
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="w-full rounded-lg px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-[color:var(--color-primary)] text-[color:var(--color-primary-text)] hover:bg-[color:var(--color-primary-hover)]"
      >
        {updateMutation.isPending ? tEdit('submitting') : tEdit('submit')}
      </button>
    </form>
  );
}

'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/client/lib/i18n';
import { profileQueries } from '@/services/queries/profile.queries';

interface AvatarUploadProps {
  readonly userId: string;
  readonly currentAvatarUrl?: string | null;
  readonly onUploadComplete: (url: string) => void;
  readonly onError?: (error: string) => void;
}

export function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete, onError }: AvatarUploadProps) {
  const t = useTranslations('profile.complete.avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl ?? null);
  const uploadMutation = profileQueries.useUploadAvatar();

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return;

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const result = await uploadMutation.mutateAsync({ userId, file });

      if (result.success) {
        setPreviewUrl(result.url);
        onUploadComplete(result.url);
      } else {
        setPreviewUrl(null);
        onError?.(result.error);
      }
    },
    [userId, uploadMutation, onUploadComplete, onError]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    void handleFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0] ?? null;
      void handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl ?? currentAvatarUrl;
  const isDataUrl = displayUrl?.startsWith('data:') ?? false;
  const isExternalUrl = displayUrl ? (displayUrl.startsWith('http://') || displayUrl.startsWith('https://')) : false;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-[color:var(--color-text-primary)]">
        {t('label')}
      </label>
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={[
          'relative w-full aspect-square max-w-xs mx-auto rounded-full border-2 border-dashed',
          'cursor-pointer transition-colors flex items-center justify-center',
          'hover:border-[color:var(--color-primary)]',
          uploadMutation.isPending
            ? 'border-[color:var(--color-primary)] opacity-50 cursor-wait'
            : 'border-[color:var(--color-border)]',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadMutation.isPending}
        />

        {uploadMutation.isPending ? (
          <div className="text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">{t('uploading')}</p>
          </div>
        ) : displayUrl ? (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {isDataUrl || isExternalUrl ? (
              <img
                src={displayUrl ?? ''}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={displayUrl}
                alt="Profile picture"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            )}
            <div className="absolute inset-0 bg-transparent hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
              <p className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-auto">
                {t('change')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-[color:var(--color-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-[color:var(--color-text-secondary)]">{t('placeholder')}</p>
            <p className="text-xs text-[color:var(--color-text-muted)] mt-1">{t('hint')}</p>
          </div>
        )}
      </div>

      {uploadMutation.isError && (
        <p className="mt-2 text-sm text-[color:var(--color-error)] text-center">
          {uploadMutation.error?.message ?? t('error')}
        </p>
      )}
    </div>
  );
}

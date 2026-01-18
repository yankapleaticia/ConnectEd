'use client';

import { useRef, useState, useCallback } from 'react';
import { X, Image as ImageIcon, Plus } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';
import Image from 'next/image';

interface ListingImageUploadProps {
  readonly images: readonly string[];
  readonly onImagesChange: (images: string[]) => void;
  readonly maxImages?: number;
  readonly disabled?: boolean;
}

export function ListingImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ListingImageUploadProps) {
  const t = useTranslations('listings.composer');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const processFiles = useCallback((files: File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    // Validate all files first
    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Not an image file`);
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: ${t('imageSizeError')}`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      console.error('Image upload errors:', errors);
    }

    // Process valid files
    const newImagePromises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagePromises).then((newImageUrls) => {
      const updatedImages = [...images, ...newImageUrls];
      if (updatedImages.length <= maxImages) {
        onImagesChange(updatedImages.slice(0, maxImages));
      }
    });
  }, [images, maxImages, onImagesChange, t]);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (fileArray.length > remainingSlots) {
        // Show error or limit files
        const limitedFiles = fileArray.slice(0, remainingSlots);
        processFiles(limitedFiles);
      } else {
        processFiles(fileArray);
      }
    },
    [images.length, maxImages, processFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleClick = () => {
    if (!disabled && images.length < maxImages) {
      fileInputRef.current?.click();
    }
  };

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {t('addImages')} ({images.length}/{maxImages})
        </label>
        {canAddMore && (
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            }}
          >
            <Plus size={16} />
            {t('addImages')}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || !canAddMore}
      />

      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={[
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            dragActive
              ? 'border-[color:var(--color-primary)] bg-[color:var(--color-surface)]'
              : 'border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]',
          ].join(' ')}
        >
          <ImageIcon
            size={32}
            className="mx-auto mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {dragActive ? 'Drop images here' : 'Click or drag images to upload'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {t('maxImages')}
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((imageUrl, index) => {
            const isDataUrl = imageUrl.startsWith('data:');
            const isExternalUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');

            return (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                {isDataUrl || isExternalUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-error)',
                      color: 'var(--color-error-text)',
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

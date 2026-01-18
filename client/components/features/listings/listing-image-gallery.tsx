'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ListingImageGalleryProps {
  readonly images: readonly string[];
  readonly title: string;
  readonly onImageClick?: (index: number) => void;
  readonly variant?: 'card' | 'detail';
}

function getGridLayout(imageCount: number, variant: 'card' | 'detail') {
  if (variant === 'card') {
    // Card variant: dynamic grids for 2+ images
    switch (imageCount) {
      case 1:
        return {
          showAll: true,
          displayCount: 1,
          gridCols: 'grid-cols-1',
          imageSizes: [{ colSpan: 1, rowSpan: 1 }],
        };
      case 2:
        return {
          showAll: true,
          displayCount: 2,
          gridCols: 'grid-cols-2',
          imageSizes: [
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
          ],
        };
      case 3:
        return {
          showAll: true,
          displayCount: 3,
          gridCols: 'grid-cols-3',
          imageSizes: [
            { colSpan: 2, rowSpan: 2 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
          ],
        };
      case 4:
        return {
          showAll: true,
          displayCount: 4,
          gridCols: 'grid-cols-2',
          imageSizes: [
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
          ],
        };
      default:
        // 5+ images: show 2x2 grid with overlay
        return {
          showAll: false,
          displayCount: 4,
          gridCols: 'grid-cols-2',
          imageSizes: [
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
            { colSpan: 1, rowSpan: 1 },
          ],
          remainingCount: imageCount - 4,
        };
    }
  }

  // Detail variant: dynamic layouts
  switch (imageCount) {
    case 1:
      return {
        showAll: true,
        displayCount: 1,
        gridCols: 'grid-cols-1',
        imageSizes: [{ colSpan: 1, rowSpan: 1 }],
      };
    case 2:
      return {
        showAll: true,
        displayCount: 2,
        gridCols: 'grid-cols-2',
        imageSizes: [
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
        ],
      };
    case 3:
      return {
        showAll: true,
        displayCount: 3,
        gridCols: 'grid-cols-3',
        imageSizes: [
          { colSpan: 2, rowSpan: 2 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
        ],
      };
    case 4:
      return {
        showAll: true,
        displayCount: 4,
        gridCols: 'grid-cols-2',
        imageSizes: [
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
        ],
      };
    default:
      // 5+ images: show 2x2 grid with overlay
      return {
        showAll: false,
        displayCount: 4,
        gridCols: 'grid-cols-2',
        imageSizes: [
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
          { colSpan: 1, rowSpan: 1 },
        ],
        remainingCount: imageCount - 4,
      };
  }
}

export function ListingImageGallery({
  images,
  title,
  onImageClick,
  variant = 'detail',
}: ListingImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) {
    return null;
  }

  const layout = getGridLayout(images.length, variant);
  const displayImages = layout.showAll ? images : images.slice(0, layout.displayCount);
  const hasMore = !layout.showAll && layout.remainingCount && layout.remainingCount > 0;

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(index);
    } else {
      setSelectedImageIndex(index);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const isExternalUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://');
  const isDataUrl = (url: string) => url.startsWith('data:');

  if (variant === 'card') {
    // Card variant: dynamic grid layouts
    const cardLayout = getGridLayout(images.length, 'card');
    const displayImages = cardLayout.showAll ? images : images.slice(0, cardLayout.displayCount);
    const hasMore = !cardLayout.showAll && cardLayout.remainingCount && cardLayout.remainingCount > 0;

    return (
      <div 
        className={`grid ${cardLayout.gridCols} gap-0.5 sm:gap-1`}
        style={{ 
          backgroundColor: 'var(--color-surface)',
          aspectRatio: images.length === 1 ? '16/9' : images.length === 2 ? '16/9' : '16/10',
          minHeight: '250px',
        }}
      >
        {displayImages.map((imageUrl, index) => {
          const hasError = imageErrors.has(index);
          const isLast = index === displayImages.length - 1;
          const showOverlay = isLast && hasMore;

          return (
            <div
              key={index}
              className={`
                relative overflow-hidden cursor-pointer
                transition-transform hover:scale-[1.01]
                ${cardLayout.imageSizes[index]?.rowSpan === 2 ? 'row-span-2' : ''}
                ${cardLayout.imageSizes[index]?.colSpan === 2 ? 'col-span-2' : ''}
                ${cardLayout.imageSizes[index]?.rowSpan === 1 ? 'aspect-square' : 'aspect-[4/3]'}
              `}
              onClick={() => handleImageClick(index)}
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {!hasError && imageUrl ? (
                <>
                  {isDataUrl(imageUrl) || isExternalUrl(imageUrl) ? (
                    <img
                      src={imageUrl}
                      alt={`${title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes={
                        cardLayout.imageSizes[index]?.colSpan === 2
                          ? '(max-width: 768px) 100vw, 50vw'
                          : '(max-width: 640px) 50vw, 25vw'
                      }
                      quality={90}
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  )}
                  {showOverlay && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      <span
                        className="text-xl sm:text-2xl font-bold text-white"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                      >
                        +{cardLayout.remainingCount}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Image unavailable
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Detail variant: dynamic grid
  return (
    <>
      <div className={`grid ${layout.gridCols} gap-2 sm:gap-3`}>
        {displayImages.map((imageUrl, index) => {
          const hasError = imageErrors.has(index);
          const isLast = index === displayImages.length - 1;
          const showOverlay = isLast && hasMore;

          return (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-lg cursor-pointer
                transition-transform hover:scale-[1.02] shadow-md hover:shadow-lg
                ${layout.imageSizes[index]?.rowSpan === 2 ? 'row-span-2' : ''}
                ${layout.imageSizes[index]?.colSpan === 2 ? 'col-span-2' : ''}
                ${layout.imageSizes[index]?.rowSpan === 1 ? 'aspect-square' : 'aspect-[4/3]'}
              `}
              onClick={() => handleImageClick(index)}
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {!hasError && imageUrl ? (
                <>
                  {isDataUrl(imageUrl) || isExternalUrl(imageUrl) ? (
                    <img
                      src={imageUrl}
                      alt={`${title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes={
                        layout.imageSizes[index]?.colSpan === 2
                          ? '(max-width: 768px) 100vw, 672px'
                          : '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 336px'
                      }
                      quality={90}
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  )}
                  {showOverlay && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      <span
                        className="text-2xl font-bold text-white"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                      >
                        +{layout.remainingCount}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Image unavailable
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            }}
            onClick={() => setSelectedImageIndex(null)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <X size={24} />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {images[selectedImageIndex] && (
              <>
                {isDataUrl(images[selectedImageIndex]) || isExternalUrl(images[selectedImageIndex]) ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${title} - Image ${selectedImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                    <Image
                      src={images[selectedImageIndex]}
                      alt={`${title} - Image ${selectedImageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

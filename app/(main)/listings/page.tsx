'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ListingsFeed } from '@/client/components/features/listings/listings-feed';
import { FiltersBar } from '@/client/components/features/listings/filters-bar';
import type { ListingsFilters } from '@/services/features/listings/listings.types';
import type { Category } from '@/types/domain/category';

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: ListingsFilters = {
    category: (searchParams.get('category') as Category | null) || undefined,
    authorId: searchParams.get('author') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sort') as 'newest' | 'oldest') || 'newest',
  };

  const handleFiltersChange = (newFilters: ListingsFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.category) {
      params.set('category', newFilters.category);
    }
    if (newFilters.authorId) {
      params.set('author', newFilters.authorId);
    }
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }
    if (newFilters.sortBy && newFilters.sortBy !== 'newest') {
      params.set('sort', newFilters.sortBy);
    }

    const queryString = params.toString();
    router.push(queryString ? `/listings?${queryString}` : '/listings');
  };

  const handlePostSuccess = () => {
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="pt-4 sm:pt-6">
        <FiltersBar filters={filters} onFiltersChange={handleFiltersChange} />
      </div>
      <ListingsFeed filters={filters} onPostSuccess={handlePostSuccess} />
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}

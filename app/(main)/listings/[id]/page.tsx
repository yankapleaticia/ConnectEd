'use client';

import { useParams } from 'next/navigation';
import { listingsQueries } from '@/services/queries/listings.queries';
import { ListingDetail } from '@/client/components/features/listings/listing-detail';

export default function ListingDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  const { data, isLoading, error } = listingsQueries.useListing(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 px-4">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center py-12 px-4">
        <p style={{ color: 'var(--color-error)' }}>Failed to load listing</p>
      </div>
    );
  }

  if (!data.success) {
    return (
      <div className="flex justify-center items-center py-12 px-4">
        <p style={{ color: 'var(--color-error)' }}>{data.error}</p>
      </div>
    );
  }

  return <ListingDetail listing={data.listing} />;
}

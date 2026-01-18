import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsService } from '@/services/features/listings/listings.service';
import { listingImageService } from '@/services/features/listings/listing-image.service';
import type { ListingsFilters, CreateListingParams, UpdateListingParams } from '@/services/features/listings/listings.types';

export const listingsQueries = {
  useListings: (filters?: ListingsFilters) => {
    return useQuery({
      queryKey: ['listings', filters],
      queryFn: () => listingsService.getListings(filters),
    });
  },

  useListing: (id: string | null) => {
    return useQuery({
      queryKey: ['listings', id],
      queryFn: () => {
        if (!id) throw new Error('Listing ID is required');
        return listingsService.getListingById(id);
      },
      enabled: !!id,
    });
  },

  useCreateListing: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ params, authorId }: { params: CreateListingParams; authorId: string }) =>
        listingsService.createListing(params, authorId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listings'] });
      },
    });
  },

  useUpdateListing: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, params, userId }: { id: string; params: UpdateListingParams; userId: string }) =>
        listingsService.updateListing(id, params, userId),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['listings'] });
        queryClient.invalidateQueries({ queryKey: ['listings', variables.id] });
      },
    });
  },

  useDeleteListing: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, userId }: { id: string; userId: string }) =>
        listingsService.deleteListing(id, userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listings'] });
      },
    });
  },

  useUploadListingImages: () => {
    return useMutation({
      mutationFn: ({ userId, listingId, files }: { userId: string; listingId: string; files: File[] }) =>
        listingImageService.uploadListingImages(userId, listingId, files),
    });
  },
};

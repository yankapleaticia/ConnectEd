import { getSupabaseClient } from '@/services/api/client';
import type { Listing } from '@/types/domain/listing';
import type { ListingResponse, ListingsFilters, CreateListingParams, UpdateListingParams } from './listings.types';

function mapSupabaseListing(row: {
  id: string;
  title: string;
  body: string;
  category: string;
  author_id: string;
  image_urls?: string[] | null;
  created_at: string;
  updated_at: string;
}): Listing {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category as Listing['category'],
    authorId: row.author_id,
    imageUrls: row.image_urls && row.image_urls.length > 0 ? row.image_urls : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const listingsService = {
  async getListings(filters?: ListingsFilters): Promise<readonly Listing[]> {
    const supabase = getSupabaseClient();
    let query = supabase.from('listings').select('*');

    // Apply category filter
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    // Apply author filter
    if (filters?.authorId) {
      query = query.eq('author_id', filters.authorId);
    }

    // Apply text search (searches title and body)
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`title.ilike.${searchTerm},body.ilike.${searchTerm}`);
    }

    // Apply date range filters
    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply sorting (default: newest first)
    const ascending = filters?.sortBy === 'oldest';
    query = query.order('created_at', { ascending });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    return data?.map(mapSupabaseListing) ?? [];
  },

  async getListingById(id: string): Promise<ListingResponse> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Listing not found' };
        }
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Listing not found' };
      }

      const listing = mapSupabaseListing(data);
      return { success: true, listing };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async createListing(params: CreateListingParams, authorId: string): Promise<ListingResponse> {
    try {
      const supabase = getSupabaseClient();
      const insertData: Record<string, unknown> = {
        title: params.title,
        body: params.body,
        category: params.category,
        author_id: authorId,
      };

      if (params.imageUrls && params.imageUrls.length > 0) {
        insertData.image_urls = params.imageUrls;
      }

      const { data, error } = await supabase
        .from('listings')
        .insert(insertData as never)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to create listing' };
      }

      const listing = mapSupabaseListing(data);
      return { success: true, listing };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async updateListing(id: string, params: UpdateListingParams, userId: string): Promise<ListingResponse> {
    try {
      const supabase = getSupabaseClient();
      
      // First verify ownership
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('author_id')
        .eq('id', id)
        .single() as { data: { author_id: string } | null; error: any };

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { success: false, error: 'Listing not found' };
        }
        return { success: false, error: fetchError.message };
      }

      if (!existingListing || existingListing.author_id !== userId) {
        return { success: false, error: 'You do not have permission to edit this listing' };
      }

      // Build update object with only provided fields
      const updateData: Record<string, unknown> = {};
      if (params.title !== undefined) {
        updateData.title = params.title;
      }
      if (params.body !== undefined) {
        updateData.body = params.body;
      }
      if (params.category !== undefined) {
        updateData.category = params.category;
      }
      if (params.imageUrls !== undefined) {
        updateData.image_urls = params.imageUrls.length > 0 ? params.imageUrls : null;
      }

      const { data, error } = await supabase
        .from('listings')
        .update(updateData as never)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to update listing' };
      }

      const listing = mapSupabaseListing(data);
      return { success: true, listing };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async deleteListing(id: string, userId: string): Promise<ListingResponse> {
    try {
      const supabase = getSupabaseClient();
      
      // First verify ownership
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('author_id')
        .eq('id', id)
        .single() as { data: { author_id: string } | null; error: any };

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { success: false, error: 'Listing not found' };
        }
        return { success: false, error: fetchError.message };
      }

      if (!existingListing || existingListing.author_id !== userId) {
        return { success: false, error: 'You do not have permission to delete this listing' };
      }

      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Return a minimal listing structure for cache invalidation
      const deletedListing: Listing = {
        id,
        title: '',
        body: '',
        category: 'JOBS',
        authorId: userId,
        createdAt: '',
        updatedAt: '',
      };

      return { success: true, listing: deletedListing };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};

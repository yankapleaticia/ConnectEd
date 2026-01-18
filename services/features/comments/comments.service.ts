import { getSupabaseClient } from '@/services/api/client';
import type { Comment } from '@/types/domain/comment';
import type { CommentResponse, CreateCommentParams, UpdateCommentParams } from './comments.types';

function mapSupabaseComment(row: {
  id: string;
  content: string;
  author_id: string;
  listing_id: string;
  created_at: string;
  updated_at: string;
}): Comment {
  return {
    id: row.id,
    content: row.content,
    authorId: row.author_id,
    listingId: row.listing_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const commentsService = {
  async getCommentsByListingId(listingId: string): Promise<readonly Comment[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    return data?.map(mapSupabaseComment) ?? [];
  },

  async createComment(params: CreateCommentParams, listingId: string, authorId: string): Promise<CommentResponse> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: params.content,
          listing_id: listingId,
          author_id: authorId,
        } as never)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to create comment' };
      }

      const comment = mapSupabaseComment(data);
      return { success: true, comment };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async updateComment(id: string, params: UpdateCommentParams, userId: string): Promise<CommentResponse> {
    try {
      const supabase = getSupabaseClient();
      
      // First verify ownership
      const { data: existingComment, error: fetchError } = await supabase
        .from('comments')
        .select('author_id')
        .eq('id', id)
        .single() as { data: { author_id: string } | null; error: any };

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { success: false, error: 'Comment not found' };
        }
        return { success: false, error: fetchError.message };
      }

      if (!existingComment || existingComment.author_id !== userId) {
        return { success: false, error: 'You do not have permission to edit this comment' };
      }

      const { data, error } = await supabase
        .from('comments')
        .update({ content: params.content } as never)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to update comment' };
      }

      const comment = mapSupabaseComment(data);
      return { success: true, comment };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async deleteComment(id: string, userId: string): Promise<CommentResponse> {
    try {
      const supabase = getSupabaseClient();
      
      // First verify ownership
      const { data: existingComment, error: fetchError } = await supabase
        .from('comments')
        .select('author_id, listing_id')
        .eq('id', id)
        .single() as { data: { author_id: string; listing_id: string } | null; error: any };

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { success: false, error: 'Comment not found' };
        }
        return { success: false, error: fetchError.message };
      }

      if (!existingComment || existingComment.author_id !== userId) {
        return { success: false, error: 'You do not have permission to delete this comment' };
      }

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Return the deleted comment structure for cache invalidation
      const deletedComment: Comment = {
        id,
        content: '',
        authorId: existingComment.author_id,
        listingId: existingComment.listing_id,
        createdAt: '',
        updatedAt: '',
      };

      return { success: true, comment: deletedComment };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};

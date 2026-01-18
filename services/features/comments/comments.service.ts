import { getSupabaseClient } from '@/services/api/client';
import type { Comment, CommentReaction, ReactionCounts, ReactionType } from '@/types/domain/comment';
import type { CommentResponse, CreateCommentParams, UpdateCommentParams, ReactionResponse } from './comments.types';

interface SupabaseCommentRow {
  id: string;
  content: string;
  author_id: string;
  listing_id: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseReactionRow {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

function mapSupabaseComment(row: SupabaseCommentRow): Comment {
  return {
    id: row.id,
    content: row.content,
    authorId: row.author_id,
    listingId: row.listing_id,
    parentCommentId: row.parent_comment_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Mutable type for building tree structure
type MutableComment = Omit<Comment, 'replies'> & {
  replies: MutableComment[];
};

function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, MutableComment>();
  const rootComments: MutableComment[] = [];

  // First pass: create map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build tree structure
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parentCommentId) {
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        parent.replies = [...parent.replies, commentWithReplies];
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  // Convert mutable tree to readonly Comment[] structure
  function convertToReadonly(mutable: MutableComment): Comment {
    return {
      ...mutable,
      replies: mutable.replies.map(convertToReadonly),
    };
  }

  return rootComments.map(convertToReadonly);
}

export const commentsService = {
  async getCommentsByListingId(listingId: string, userId?: string): Promise<readonly Comment[]> {
    const supabase = getSupabaseClient();
    
    // Fetch all comments for the listing
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      throw new Error(`Failed to fetch comments: ${commentsError.message}`);
    }

    if (!commentsData || commentsData.length === 0) {
      return [];
    }

    const comments = commentsData.map(mapSupabaseComment);
    const commentIds = comments.map((c) => c.id);

    // Fetch all reactions for these comments
    const { data: reactionsData } = await supabase
      .from('comment_reactions')
      .select('*')
      .in('comment_id', commentIds);

    // Build reaction counts and user reactions (using mutable types during building)
    type MutableReactionCounts = {
      like: number;
      love: number;
      haha: number;
      wow: number;
      sad: number;
      angry: number;
      total: number;
    };

    const reactionsMap = new Map<string, { reactions: CommentReaction[]; counts: MutableReactionCounts; userReaction: ReactionType | null }>();
    
    commentIds.forEach((id) => {
      reactionsMap.set(id, {
        reactions: [],
        counts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0, total: 0 },
        userReaction: null,
      });
    });

    if (reactionsData) {
      reactionsData.forEach((row: any) => {
        const reaction: CommentReaction = {
          id: row.id,
          commentId: row.comment_id,
          userId: row.user_id,
          reactionType: row.reaction_type as ReactionType,
          createdAt: row.created_at,
        };

        const commentReactions = reactionsMap.get(row.comment_id)!;
        commentReactions.reactions.push(reaction);
        commentReactions.counts[reaction.reactionType]++;
        commentReactions.counts.total++;

        if (userId && row.user_id === userId) {
          commentReactions.userReaction = reaction.reactionType;
        }
      });
    }

    // Attach reactions to comments (convert mutable counts to readonly ReactionCounts)
    const commentsWithReactions = comments.map((comment) => {
      const reactionData = reactionsMap.get(comment.id)!;
      const readonlyCounts: ReactionCounts = {
        like: reactionData.counts.like,
        love: reactionData.counts.love,
        haha: reactionData.counts.haha,
        wow: reactionData.counts.wow,
        sad: reactionData.counts.sad,
        angry: reactionData.counts.angry,
        total: reactionData.counts.total,
      };
      return {
        ...comment,
        reactions: reactionData.reactions,
        reactionCounts: readonlyCounts,
        userReaction: reactionData.userReaction,
      };
    });

    // Build tree structure
    return buildCommentTree(commentsWithReactions);
  },

  async createComment(params: CreateCommentParams, listingId: string, authorId: string): Promise<CommentResponse> {
    try {
      const supabase = getSupabaseClient();
      
      // If parentCommentId is provided, verify it exists
      if (params.parentCommentId) {
        const { data: parentComment, error: parentError } = await supabase
          .from('comments')
          .select('id')
          .eq('id', params.parentCommentId)
          .single();

        if (parentError || !parentComment) {
          return { success: false, error: 'Parent comment not found' };
        }
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: params.content,
          listing_id: listingId,
          author_id: authorId,
          parent_comment_id: params.parentCommentId || null,
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
        .single() as { data: SupabaseCommentRow | null; error: any };

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
        parentCommentId: null,
        createdAt: '',
        updatedAt: '',
      };

      return { success: true, comment: deletedComment };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async addReaction(commentId: string, userId: string, reactionType: ReactionType): Promise<ReactionResponse> {
    try {
      const supabase = getSupabaseClient();

      // Check if user already has a reaction on this comment
      const { data: existingReaction } = await supabase
        .from('comment_reactions')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single() as { data: SupabaseReactionRow | null; error: any };

      if (existingReaction) {
        // Update existing reaction
        const { data, error } = await supabase
          .from('comment_reactions')
          .update({ reaction_type: reactionType } as never)
          .eq('id', existingReaction.id)
          .select()
          .single() as { data: SupabaseReactionRow | null; error: any };

        if (error) {
          return { success: false, error: error.message };
        }

        if (!data) {
          return { success: false, error: 'Failed to update reaction' };
        }

        const reaction: CommentReaction = {
          id: data.id,
          commentId: data.comment_id,
          userId: data.user_id,
          reactionType: data.reaction_type as ReactionType,
          createdAt: data.created_at,
        };

        return { success: true, reaction };
      } else {
        // Create new reaction
        const { data, error } = await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: userId,
            reaction_type: reactionType,
          } as never)
          .select()
          .single() as { data: SupabaseReactionRow | null; error: any };

        if (error) {
          return { success: false, error: error.message };
        }

        if (!data) {
          return { success: false, error: 'Failed to add reaction' };
        }

        const reaction: CommentReaction = {
          id: data.id,
          commentId: data.comment_id,
          userId: data.user_id,
          reactionType: data.reaction_type as ReactionType,
          createdAt: data.created_at,
        };

        return { success: true, reaction };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async removeReaction(commentId: string, userId: string): Promise<ReactionResponse> {
    try {
      const supabase = getSupabaseClient();

      const { data: existingReaction, error: fetchError } = await supabase
        .from('comment_reactions')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single() as { data: SupabaseReactionRow | null; error: any };

      if (fetchError || !existingReaction) {
        return { success: false, error: 'Reaction not found' };
      }

      const { error } = await supabase
        .from('comment_reactions')
        .delete()
        .eq('id', existingReaction.id);

      if (error) {
        return { success: false, error: error.message };
      }

      const reaction: CommentReaction = {
        id: existingReaction.id,
        commentId: existingReaction.comment_id,
        userId: existingReaction.user_id,
        reactionType: existingReaction.reaction_type as ReactionType,
        createdAt: existingReaction.created_at,
      };

      return { success: true, reaction };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};

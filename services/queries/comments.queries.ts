import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '@/services/features/comments/comments.service';
import type { CreateCommentParams, UpdateCommentParams } from '@/services/features/comments/comments.types';
import type { ReactionType } from '@/types/domain/comment';

export const commentsQueries = {
  useComments: (listingId: string | null, userId?: string) => {
    return useQuery({
      queryKey: ['comments', listingId, userId],
      queryFn: () => {
        if (!listingId) throw new Error('Listing ID is required');
        return commentsService.getCommentsByListingId(listingId, userId);
      },
      enabled: !!listingId,
    });
  },

  useCreateComment: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ params, listingId, authorId }: { params: CreateCommentParams; listingId: string; authorId: string }) =>
        commentsService.createComment(params, listingId, authorId),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
      },
    });
  },

  useUpdateComment: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, params, userId }: { id: string; params: UpdateCommentParams; userId: string }) =>
        commentsService.updateComment(id, params, userId),
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['comments', data.comment.listingId] });
        }
      },
    });
  },

  useDeleteComment: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, userId, listingId }: { id: string; userId: string; listingId: string }) =>
        commentsService.deleteComment(id, userId),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
      },
    });
  },

  useAddReaction: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ commentId, userId, reactionType, listingId }: { commentId: string; userId: string; reactionType: ReactionType; listingId: string }) =>
        commentsService.addReaction(commentId, userId, reactionType),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
      },
    });
  },

  useRemoveReaction: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ commentId, userId, listingId }: { commentId: string; userId: string; listingId: string }) =>
        commentsService.removeReaction(commentId, userId),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['comments', variables.listingId] });
      },
    });
  },
};

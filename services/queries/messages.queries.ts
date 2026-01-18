import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '@/services/features/messages/messages.service';
import type { CreateMessageParams } from '@/services/features/messages/messages.types';

export const messagesQueries = {
  useConversations: (userId: string | null) => {
    return useQuery({
      queryKey: ['conversations', userId],
      queryFn: () => {
        if (!userId) throw new Error('User ID is required');
        return messagesService.getConversations(userId);
      },
      enabled: !!userId,
    });
  },

  useMessages: (userId: string | null, otherUserId: string | null) => {
    return useQuery({
      queryKey: ['messages', userId, otherUserId],
      queryFn: () => {
        if (!userId || !otherUserId) throw new Error('User ID and Other User ID are required');
        return messagesService.getMessages(userId, otherUserId);
      },
      enabled: !!userId && !!otherUserId,
    });
  },

  useCreateMessage: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ params, senderId }: { params: CreateMessageParams; senderId: string }) =>
        messagesService.createMessage(params, senderId),
      onSuccess: (_data, variables) => {
        // Invalidate conversations list for sender
        queryClient.invalidateQueries({ queryKey: ['conversations', variables.senderId] });
        // Invalidate messages thread for this conversation
        queryClient.invalidateQueries({ queryKey: ['messages', variables.senderId, variables.params.receiverId] });
      },
    });
  },
};

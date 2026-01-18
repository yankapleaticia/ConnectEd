import { getSupabaseClient } from '@/services/api/client';
import type { Message } from '@/types/domain/message';
import type { MessageResponse, CreateMessageParams, Conversation } from './messages.types';

function mapSupabaseMessage(row: {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
}): Message {
  return {
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    body: row.body,
    createdAt: row.created_at,
  };
}

export const messagesService = {
  async createMessage(params: CreateMessageParams, senderId: string): Promise<MessageResponse> {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('messages')
        .insert({
          body: params.body,
          sender_id: senderId,
          receiver_id: params.receiverId,
        } as never)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Failed to create message' };
      }

      const message = mapSupabaseMessage(data);
      return { success: true, message };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async getConversations(userId: string): Promise<readonly Conversation[]> {
    const supabase = getSupabaseClient();
    
    // Get all messages where user is sender or receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false }) as { data: Array<{ id: string; sender_id: string; receiver_id: string; body: string; created_at: string }> | null; error: any };

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    if (!messages || messages.length === 0) {
      return [];
    }

    // Group by other user and get last message
    const conversationMap = new Map<string, Message>();

    for (const msg of messages) {
      const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, mapSupabaseMessage(msg));
      }
    }

    // Convert to Conversation array
    const conversations: Conversation[] = Array.from(conversationMap.entries()).map(([otherUserId, lastMessage]) => ({
      userId: otherUserId,
      lastMessage,
    }));

    return conversations;
  },

  async getMessages(userId: string, otherUserId: string): Promise<readonly Message[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true }) as { data: Array<{ id: string; sender_id: string; receiver_id: string; body: string; created_at: string }> | null; error: any };

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data?.map(mapSupabaseMessage) ?? [];
  },
};

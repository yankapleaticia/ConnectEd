import type { Message } from '@/types/domain/message';

export interface CreateMessageParams {
  readonly body: string;
  readonly receiverId: string;
}

export interface MessageResult {
  readonly success: true;
  readonly message: Message;
}

export interface MessageError {
  readonly success: false;
  readonly error: string;
}

export type MessageResponse = MessageResult | MessageError;

export interface Conversation {
  readonly userId: string;
  readonly lastMessage: Message | null;
}

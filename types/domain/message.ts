export interface Message {
  readonly id: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly body: string;
  readonly createdAt: string;
}

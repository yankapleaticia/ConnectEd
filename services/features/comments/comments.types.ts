import type { Comment } from '@/types/domain/comment';

export interface CreateCommentParams {
  readonly content: string;
}

export interface UpdateCommentParams {
  readonly content: string;
}

export interface CommentResult {
  readonly success: true;
  readonly comment: Comment;
}

export interface CommentError {
  readonly success: false;
  readonly error: string;
}

export type CommentResponse = CommentResult | CommentError;

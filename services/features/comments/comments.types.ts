import type { Comment, CommentReaction, ReactionType } from '@/types/domain/comment';

export interface CreateCommentParams {
  readonly content: string;
  readonly parentCommentId?: string;
}

export interface UpdateCommentParams {
  readonly content: string;
}

export interface CreateReactionParams {
  readonly commentId: string;
  readonly userId: string;
  readonly reactionType: ReactionType;
}

export interface UpdateReactionParams {
  readonly reactionId: string;
  readonly reactionType: ReactionType;
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

export interface ReactionResult {
  readonly success: true;
  readonly reaction: CommentReaction;
}

export interface ReactionError {
  readonly success: false;
  readonly error: string;
}

export type ReactionResponse = ReactionResult | ReactionError;

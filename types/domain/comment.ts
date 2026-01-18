export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface CommentReaction {
  readonly id: string;
  readonly commentId: string;
  readonly userId: string;
  readonly reactionType: ReactionType;
  readonly createdAt: string;
}

export interface ReactionCounts {
  readonly like: number;
  readonly love: number;
  readonly haha: number;
  readonly wow: number;
  readonly sad: number;
  readonly angry: number;
  readonly total: number;
}

export interface Comment {
  readonly id: string;
  readonly content: string;
  readonly authorId: string;
  readonly listingId: string;
  readonly parentCommentId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly reactions?: readonly CommentReaction[];
  readonly reactionCounts?: ReactionCounts;
  readonly userReaction?: ReactionType | null;
  readonly replies?: readonly Comment[];
  readonly replyCount?: number;
}

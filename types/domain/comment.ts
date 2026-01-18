export interface Comment {
  readonly id: string;
  readonly content: string;
  readonly authorId: string;
  readonly listingId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

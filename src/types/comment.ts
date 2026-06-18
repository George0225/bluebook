import type { UserRef } from "./post";

export interface Comment {
  id: string;
  postId: string;
  author: UserRef;
  content: string;
  likes: number;
  isAnalysis: boolean;
  replies: Comment[];
  createdAt: string;
}

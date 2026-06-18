export type SectionId = "awareness" | "social" | "gaming" | "fitness" | "finance";

export interface UserRef {
  id: string;
  name: string;
  avatarColor: string;
  avatarInitial: string;
}

export type PostType = "image-text" | "long-text" | "poll";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
}

export interface PostStats {
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
}

export interface Post {
  id: string;
  type: PostType;
  sectionId: SectionId;
  author: UserRef;
  title: string;
  summary: string;
  content: string;
  coverGradient: string;
  coverAspectRatio: number;
  images: string[];
  tags: string[];
  stats: PostStats;
  isHot: boolean;
  isFeatured: boolean;
  createdAt: string;
  poll?: Poll;
}

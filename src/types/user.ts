import type { SectionId } from "./post";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserStats {
  posts: number;
  likes: number;
  bookmarks: number;
  followers: number;
  following: number;
  influenceScore: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarColor: string;
  avatarInitial: string;
  stats: UserStats;
  achievements: Achievement[];
  joinedAt: string;
  sections: SectionId[];
}

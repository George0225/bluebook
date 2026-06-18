import { create } from "zustand";

interface InteractionState {
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  likeCountDeltas: Record<string, number>;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  isBookmarked: (postId: string) => boolean;
  getLikeDelta: (postId: string) => number;
}

export const useInteractionStore = create<InteractionState>((set, get) => ({
  likedPosts: new Set(),
  bookmarkedPosts: new Set(),
  likeCountDeltas: {},
  toggleLike: (postId) =>
    set((state) => {
      const liked = new Set(state.likedPosts);
      const deltas = { ...state.likeCountDeltas };
      if (liked.has(postId)) {
        liked.delete(postId);
        deltas[postId] = (deltas[postId] || 0) - 1;
      } else {
        liked.add(postId);
        deltas[postId] = (deltas[postId] || 0) + 1;
      }
      return { likedPosts: liked, likeCountDeltas: deltas };
    }),
  toggleBookmark: (postId) =>
    set((state) => {
      const bookmarked = new Set(state.bookmarkedPosts);
      if (bookmarked.has(postId)) {
        bookmarked.delete(postId);
      } else {
        bookmarked.add(postId);
      }
      return { bookmarkedPosts: bookmarked };
    }),
  isLiked: (postId) => get().likedPosts.has(postId),
  isBookmarked: (postId) => get().bookmarkedPosts.has(postId),
  getLikeDelta: (postId) => get().likeCountDeltas[postId] || 0,
}));

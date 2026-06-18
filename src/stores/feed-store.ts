import { create } from "zustand";
import type { SectionId } from "@/types/post";

interface FeedState {
  activeTab: "recommended" | "following";
  activeSection: SectionId | "all";
  searchQuery: string;
  searchFilters: { section?: SectionId; sort?: "latest" | "hot" };
  setTab: (tab: "recommended" | "following") => void;
  setSection: (section: SectionId | "all") => void;
  setSearch: (query: string) => void;
  setSearchFilters: (filters: FeedState["searchFilters"]) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  activeTab: "recommended",
  activeSection: "all",
  searchQuery: "",
  searchFilters: {},
  setTab: (tab) => set({ activeTab: tab }),
  setSection: (section) => set({ activeSection: section }),
  setSearch: (query) => set({ searchQuery: query }),
  setSearchFilters: (filters) => set({ searchFilters: filters }),
}));

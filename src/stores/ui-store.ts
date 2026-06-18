import { create } from "zustand";

type BottomTab = "home" | "discover" | "create" | "messages" | "profile";

interface UIState {
  activeBottomTab: BottomTab;
  createSheetOpen: boolean;
  setBottomTab: (tab: BottomTab) => void;
  toggleCreateSheet: () => void;
  setCreateSheet: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeBottomTab: "home",
  createSheetOpen: false,
  setBottomTab: (tab) => set({ activeBottomTab: tab }),
  toggleCreateSheet: () => set((s) => ({ createSheetOpen: !s.createSheetOpen })),
  setCreateSheet: (open) => set({ createSheetOpen: open }),
}));

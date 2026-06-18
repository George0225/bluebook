import { create } from "zustand";
import type { User } from "@/types/user";
import { currentUser } from "@/data/mock-users";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, phone: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (_phone: string, code: string) => {
    if (code === "1234") {
      set({ user: currentUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  register: async (name: string) => {
    const user = { ...currentUser, name };
    set({ user, isAuthenticated: true });
    return true;
  },
}));

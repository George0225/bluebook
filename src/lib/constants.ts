import type { Section } from "@/types/section";
import type { SectionId } from "@/types/post";

export const SECTIONS: Record<SectionId, Section & { nameKey: string; descKey: string }> = {
  awareness: {
    id: "awareness",
    icon: "Shield",
    color: "var(--bb-section-awareness)",
    route: "/awareness",
    nameKey: "sections.awareness.name",
    descKey: "sections.awareness.desc",
  },
  social: {
    id: "social",
    icon: "Search",
    color: "var(--bb-section-social)",
    route: "/social",
    nameKey: "sections.social.name",
    descKey: "sections.social.desc",
  },
  gaming: {
    id: "gaming",
    icon: "Gamepad2",
    color: "var(--bb-section-gaming)",
    route: "/gaming",
    nameKey: "sections.gaming.name",
    descKey: "sections.gaming.desc",
  },
  fitness: {
    id: "fitness",
    icon: "Dumbbell",
    color: "var(--bb-section-fitness)",
    route: "/fitness",
    nameKey: "sections.fitness.name",
    descKey: "sections.fitness.desc",
  },
  finance: {
    id: "finance",
    icon: "TrendingUp",
    color: "var(--bb-section-finance)",
    route: "/finance",
    nameKey: "sections.finance.name",
    descKey: "sections.finance.desc",
  },
} as const;

export const ROUTES = {
  home: "/",
  discover: "/discover",
  create: "/create",
  messages: "/messages",
  profile: "/profile",
  search: "/search",
  login: "/auth/login",
  register: "/auth/register",
  post: (id: string) => `/post/${id}`,
  user: (id: string) => `/user/${id}`,
} as const;

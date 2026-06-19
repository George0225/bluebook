"use client";

import { cn } from "@/lib/utils";
import type { SectionId } from "@/types/post";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Shield,
  Search,
  Gamepad2,
  Dumbbell,
  TrendingUp,
};

interface CategoryTabsProps {
  activeSection: SectionId | "all";
  onSectionChange: (section: SectionId | "all") => void;
}

export function CategoryTabs({ activeSection, onSectionChange }: CategoryTabsProps) {
  const { t } = useI18n();

  const allTabs: { id: SectionId | "all"; label: string; icon?: string; color?: string }[] = [
    { id: "all", label: t("feed.allCategories") },
    ...Object.values(SECTIONS).map((s) => ({
      id: s.id,
      label: t(s.nameKey),
      icon: s.icon,
      color: s.color,
    })),
  ];

  return (
    <div className="sticky top-14 z-30 glass border-b border-white/5">
      <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2 py-2.5">
        {allTabs.map((tab) => {
          const isActive = activeSection === tab.id;
          const IconComponent = tab.icon ? iconMap[tab.icon] : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-bb-amber to-bb-gold text-bb-surface-0 shadow-bb-button"
                  : "bg-white/5 text-bb-text-2 hover:bg-white/10 hover:text-bb-text-1 hover:scale-105"
              )}
              style={isActive ? { boxShadow: "0 0 16px rgba(232,120,42,0.3)" } : undefined}
            >
              {IconComponent && <IconComponent className="h-3.5 w-3.5" strokeWidth={2} />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

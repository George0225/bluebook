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
    <div className="sticky top-14 z-30 bg-bb-surface-0/95 backdrop-blur-sm border-b border-bb-border">
      <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2 py-2.5">
        {allTabs.map((tab) => {
          const isActive = activeSection === tab.id;
          const IconComponent = tab.icon ? iconMap[tab.icon] : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-bb-amber text-bb-surface-0 shadow-bb-button"
                  : "bg-bb-surface-2 text-bb-text-2 hover:bg-bb-surface-3 hover:text-bb-text-1"
              )}
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

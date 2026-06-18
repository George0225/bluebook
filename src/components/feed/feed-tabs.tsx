"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";

interface FeedTabsProps {
  activeTab: "recommended" | "following";
  onTabChange: (tab: "recommended" | "following") => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const { t } = useI18n();

  const tabs = [
    { id: "recommended" as const, label: t("feed.recommended") },
    { id: "following" as const, label: t("feed.following") },
  ];

  return (
    <div className="flex items-center gap-6 px-4 py-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative text-sm font-medium py-1.5 transition-colors",
              isActive ? "text-bb-text-1" : "text-bb-text-3 hover:text-bb-text-2"
            )}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full metallic-gradient" />
            )}
          </button>
        );
      })}
    </div>
  );
}

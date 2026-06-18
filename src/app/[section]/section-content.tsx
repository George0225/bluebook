"use client";

import { Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { IndustrialGrid } from "@/components/feed/industrial-grid";
import { useI18n } from "@/i18n/provider";
import { useResponsive } from "@/hooks/use-responsive";
import { getPostsBySection } from "@/data/mock-posts";
import { SECTIONS } from "@/lib/constants";
import type { SectionId } from "@/types/post";

const iconMap = { Shield, Search, Gamepad2, Dumbbell, TrendingUp } as const;

export function SectionContent({ sectionId }: { sectionId: string }) {
  const { t } = useI18n();
  const breakpoint = useResponsive();

  const section = SECTIONS[sectionId as SectionId];
  const posts = getPostsBySection(sectionId as SectionId);
  const Icon = iconMap[section.icon as keyof typeof iconMap];
  const gridColumns = breakpoint === "mobile" ? 2 : 3;

  return (
    <ResponsiveShell showBack title={t(section.nameKey)}>
      <div className="max-w-2xl mx-auto">
        {/* Hero banner */}
        <div
          className="relative px-4 py-10 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${section.color}20, transparent)` }}
        >
          <div className="relative flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${section.color}30` }}
            >
              <div style={{ color: section.color }}>
                <Icon className="h-8 w-8" strokeWidth={2} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-bb-text-1">{t(section.nameKey)}</h1>
              <p className="text-sm text-bb-text-3 mt-0.5">{t(section.descKey)}</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <IndustrialGrid posts={posts} columns={gridColumns} />
        ) : (
          <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
            暂无内容
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}

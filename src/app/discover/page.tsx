"use client";

import Link from "next/link";
import { Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { CSS3DGrid } from "@/components/feed/css3d-grid";
import { useI18n } from "@/i18n/provider";
import { useResponsive } from "@/hooks/use-responsive";
import { usePosts } from "@/hooks/use-posts";
import { SECTIONS } from "@/lib/constants";

const sectionIcons = { Shield, Search, Gamepad2, Dumbbell, TrendingUp } as const;

export default function DiscoverPage() {
  const { t } = useI18n();
  const breakpoint = useResponsive();
  const { posts: hotPosts, loading, error } = usePosts({ type: "hot" });
  const gridColumns = breakpoint === "mobile" ? 2 : 3;

  return (
    <ResponsiveShell title={t("nav.discover")}>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <h2 className="text-base font-bold text-bb-text-1 mb-3">{t("nav.discover")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(SECTIONS).map((section) => {
            const Icon = sectionIcons[section.icon as keyof typeof sectionIcons];
            return (
              <Link
                key={section.id}
                href={section.route}
                className="group relative overflow-hidden rounded-card border border-bb-border bg-bb-surface-1 p-4 shadow-bb-card hover:shadow-bb-elevated hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: section.color }} />
                <div className="relative space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${section.color}25` }}>
                    <div style={{ color: section.color }}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-bb-text-1">{t(section.nameKey)}</h3>
                    <p className="text-xs text-bb-text-3 mt-1">{t(section.descKey)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-2">
        <h2 className="text-base font-bold text-bb-text-1 mb-4">{t("feed.hotPosts")}</h2>
        {loading ? (
          <div className="flex items-center justify-center py-20 text-bb-text-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-bb-amber border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
            加载失败，请稍后再试
          </div>
        ) : hotPosts.length > 0 ? (
          <CSS3DGrid posts={hotPosts} columns={gridColumns} />
        ) : (
          <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
            暂无内容
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}

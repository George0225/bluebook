"use client";

import Link from "next/link";
import { Flame, Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { getHotPosts } from "@/data/mock-posts";

const sectionIcons = { Shield, Search, Gamepad2, Dumbbell, TrendingUp } as const;

export default function DiscoverPage() {
  const { t } = useI18n();
  const hotPosts = getHotPosts();

  return (
    <ResponsiveShell title={t("nav.discover")}>
      <div className="max-w-2xl mx-auto px-4 py-6">
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
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: section.color }}
                />
                <div className="relative space-y-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${section.color}25` }}
                  >
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

        <div className="mt-8">
          <h2 className="text-base font-bold text-bb-text-1 mb-4">{t("feed.hotPosts")}</h2>
          <div className="space-y-2">
            {hotPosts.slice(0, 10).map((post, idx) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="flex items-center gap-3 rounded-card bg-bb-surface-1 border border-bb-border p-3 hover:bg-bb-surface-2 transition-colors"
              >
                <span className="text-lg font-black text-bb-amber w-6 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-bb-text-1 font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <GradientAvatar
                      color={post.author.avatarColor}
                      initial={post.author.avatarInitial}
                      size="sm"
                      className="!h-4 !w-4 !text-[8px]"
                    />
                    <span className="text-[10px] text-bb-text-3">{post.author.name}</span>
                    <Flame className="h-3 w-3 text-bb-amber" />
                    <span className="text-[10px] text-bb-text-3">{post.stats.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}

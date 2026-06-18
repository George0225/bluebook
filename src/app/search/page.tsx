"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { IndustrialGrid } from "@/components/feed/industrial-grid";
import { useI18n } from "@/i18n/provider";
import { mockPosts } from "@/data/mock-posts";
import { SECTIONS } from "@/lib/constants";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/types/post";

const trendingTags = [
  "情感认知", "避坑指南", "游戏攻略", "增肌", "副业", "数码评测",
  "社交技巧", "健身计划", "理财入门", "职场社交",
];

export default function SearchPage() {
  const { t } = useI18n();
  const breakpoint = useResponsive();
  const [query, setQuery] = useState("");
  const [filterSection, setFilterSection] = useState<SectionId | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "hot">("hot");

  const results = useMemo(() => {
    let posts = mockPosts;
    if (query.trim()) {
      const q = query.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (filterSection !== "all") {
      posts = posts.filter((p) => p.sectionId === filterSection);
    }
    if (sortBy === "hot") {
      posts = [...posts].sort((a, b) => b.stats.likes - a.stats.likes);
    }
    return posts;
  }, [query, filterSection, sortBy]);

  const gridColumns = breakpoint === "mobile" ? 2 : 3;

  return (
    <ResponsiveShell showBack>
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search bar */}
        <div className="flex items-center gap-2 rounded-lg bg-bb-surface-2 px-3 py-2.5">
          <SearchIcon className="h-4 w-4 text-bb-text-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            autoFocus
            className="flex-1 bg-transparent text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="h-4 w-4 text-bb-text-3" />
            </button>
          )}
        </div>

        {/* Trending tags */}
        {!query && (
          <div>
            <h3 className="text-xs font-medium text-bb-text-3 mb-2">{t("search.trending")}</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full bg-bb-surface-2 px-3 py-1.5 text-xs text-bb-text-2 hover:bg-bb-surface-3 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section filters */}
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setFilterSection("all")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] whitespace-nowrap",
              filterSection === "all" ? "bg-bb-amber text-bb-surface-0" : "bg-bb-surface-2 text-bb-text-3"
            )}
          >
            {t("search.allSections")}
          </button>
          {Object.values(SECTIONS).map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterSection(s.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] whitespace-nowrap",
                filterSection === s.id ? "bg-bb-amber text-bb-surface-0" : "bg-bb-surface-2 text-bb-text-3"
              )}
            >
              {t(s.nameKey)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("hot")}
            className={cn(
              "rounded-full px-3 py-1 text-xs",
              sortBy === "hot" ? "bg-bb-surface-3 text-bb-text-1" : "text-bb-text-3"
            )}
          >
            {t("feed.hot")}
          </button>
          <button
            onClick={() => setSortBy("latest")}
            className={cn(
              "rounded-full px-3 py-1 text-xs",
              sortBy === "latest" ? "bg-bb-surface-3 text-bb-text-1" : "text-bb-text-3"
            )}
          >
            {t("feed.latest")}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <IndustrialGrid posts={results} columns={gridColumns} />
        ) : (
          <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
            {t("common.noResults")}
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}

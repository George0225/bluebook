"use client";

import { useMemo } from "react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { FeedTabs } from "@/components/feed/feed-tabs";
import { CSS3DGrid } from "@/components/feed/css3d-grid";
import { useFeedStore } from "@/stores/feed-store";
import { useResponsive } from "@/hooks/use-responsive";
import { usePosts } from "@/hooks/use-posts";
import type { SectionId } from "@/types/post";

export default function HomePage() {
  const { activeTab, activeSection, setTab, setSection } = useFeedStore();
  const breakpoint = useResponsive();
  const { posts: allPosts, loading, error } = usePosts({ type: "all" });

  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    if (activeSection !== "all") {
      posts = posts.filter((p) => p.sectionId === activeSection);
    }
    if (activeTab === "following") {
      posts = posts.filter((p) => ["u1", "u2", "u4", "u5"].includes(p.author.id));
    }
    return posts;
  }, [activeTab, activeSection, allPosts]);

  const gridColumns = breakpoint === "mobile" ? 2 : 3;

  return (
    <ResponsiveShell>
      <div className="max-w-2xl mx-auto">
        <FeedTabs activeTab={activeTab} onTabChange={setTab} />
        <CategoryTabs
          activeSection={activeSection as SectionId | "all"}
          onSectionChange={setSection}
        />
        {loading ? (
          <div className="flex items-center justify-center py-20 text-bb-text-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-bb-amber border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
            加载失败，请稍后再试
          </div>
        ) : filteredPosts.length > 0 ? (
          <CSS3DGrid posts={filteredPosts} columns={gridColumns} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-bb-text-3">
            <p className="text-sm">暂无内容</p>
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}

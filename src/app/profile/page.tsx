"use client";

import { useState } from "react";
import { Settings, PenTool, Heart, Bookmark, Users, Flame, Star, Shield, Brain } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { FeedCard } from "@/components/feed/feed-card";
import { useI18n } from "@/i18n/provider";
import { currentUser } from "@/data/mock-users";
import { mockPosts } from "@/data/mock-posts";
import { cn } from "@/lib/utils";

const rarityColors = {
  common: "#9DA2B3",
  rare: "#5B9BD5",
  epic: "#7B68EE",
  legendary: "#E8782A",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenTool, Heart, Users, Flame, Star, Shield, Brain,
  Dumbbell: Flame, Gamepad2: Star, Monitor: Star, Car: Star,
  Bookmark, TrendingUp: Flame,
};

type ProfileTab = "posts" | "bookmarks" | "likes";

export default function ProfilePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  const user = currentUser;
  const userPosts = mockPosts.filter((p) => p.author.id === user.id);

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "posts", label: t("profile.myPosts") },
    { id: "bookmarks", label: t("profile.myBookmarks") },
    { id: "likes", label: t("profile.myLikes") },
  ];

  return (
    <ResponsiveShell title={t("nav.profile")}>
      <div className="max-w-2xl mx-auto">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-bb-amber/20 to-bb-gold/20" />

        {/* Avatar overlay */}
        <div className="px-4 -mt-10 text-center space-y-4">
          <GradientAvatar
            color={user.avatarColor}
            initial={user.avatarInitial}
            size="xl"
            className="mx-auto ring-2 ring-bb-amber ring-offset-2 ring-offset-bb-surface-0"
          />
          <div>
            <h1 className="text-lg font-bold text-bb-text-1">{user.name}</h1>
            <p className="text-xs text-bb-text-3">@{user.handle}</p>
          </div>
          <p className="text-sm text-bb-text-2 max-w-xs mx-auto">{user.bio}</p>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: user.stats.posts, label: t("profile.posts") },
              { value: user.stats.followers, label: t("profile.followers") },
              { value: user.stats.following, label: t("profile.following") },
              { value: user.stats.influenceScore, label: t("profile.influenceScore") },
            ].map((stat) => (
              <div key={stat.label} className="rounded-card bg-bb-surface-1 border border-bb-border p-3 text-center">
                <p className="text-base font-bold text-bb-text-1">{stat.value}</p>
                <p className="text-[10px] text-bb-text-3">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Influence bar */}
        <div className="mx-4 mt-4 rounded-card bg-bb-surface-1 border border-bb-border p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-bb-text-2">{t("profile.influenceScore")}</span>
            <span className="text-xl font-black text-bb-amber">{user.stats.influenceScore}</span>
          </div>
          <div className="h-2 rounded-full bg-bb-surface-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-bb-amber to-bb-gold"
              style={{ width: `${Math.min(user.stats.influenceScore / 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 mb-4 mt-4">
          <h3 className="text-xs font-medium text-bb-text-3 mb-2">{t("profile.achievements")}</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {user.achievements.map((ach) => {
              const Icon = iconMap[ach.icon] || Star;
              return (
                <div
                  key={ach.id}
                  className="flex-shrink-0 flex flex-col items-center gap-1 rounded-card bg-bb-surface-1 border border-bb-border p-3 min-w-[80px]"
                >
                  <div style={{ color: rarityColors[ach.rarity] }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] text-bb-text-2 text-center leading-tight">{ach.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bb-border px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 text-xs font-medium transition-colors border-b-2 text-center",
                activeTab === tab.id
                  ? "text-bb-amber border-bb-amber"
                  : "text-bb-text-3 border-transparent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="px-3 py-3">
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {userPosts.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-sm text-bb-text-3">
              暂无内容
            </div>
          )}
        </div>
      </div>
    </ResponsiveShell>
  );
}

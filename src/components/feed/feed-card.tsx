"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import type { Post } from "@/types/post";
import { SECTIONS } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";
import { GradientCover } from "@/components/shared/gradient-cover";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { LikeButton } from "@/components/post/like-button";
import { TagBadge } from "@/components/shared/tag-badge";

interface FeedCardProps {
  post: Post;
  size?: "standard" | "large";
}

export function FeedCard({ post, size = "standard" }: FeedCardProps) {
  const { t } = useI18n();
  const section = SECTIONS[post.sectionId];

  return (
    <Link
      href={`/post/${post.id}`}
      className="group block"
    >
      <div className="rounded-card bg-bb-surface-1 border border-bb-border overflow-hidden shadow-bb-card group-hover:shadow-bb-elevated group-hover:-translate-y-0.5 transition-all duration-200">
        <GradientCover
          gradient={post.coverGradient}
          aspectRatio={post.coverAspectRatio}
          variant={size}
        />

        <div className="p-3 space-y-2">
          <div className="flex items-start gap-1.5">
            {post.isHot && (
              <Flame className="h-3.5 w-3.5 text-bb-amber flex-shrink-0 mt-0.5" />
            )}
            <h3 className={`font-semibold text-bb-text-1 line-clamp-2 leading-tight ${size === "large" ? "text-base" : "text-sm"}`}>
              {post.title}
            </h3>
          </div>

          {size === "large" && (
            <p className="text-xs text-bb-text-2 line-clamp-2">{post.summary}</p>
          )}

          <TagBadge
            label={t(section.nameKey)}
            color={section.color}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <GradientAvatar
                color={post.author.avatarColor}
                initial={post.author.avatarInitial}
                size="sm"
              />
              <span className="text-xs text-bb-text-3 truncate max-w-[80px]">
                {post.author.name}
              </span>
            </div>

            <LikeButton postId={post.id} initialCount={post.stats.likes} />
          </div>
        </div>
      </div>
    </Link>
  );
}

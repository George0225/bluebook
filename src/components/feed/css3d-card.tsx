"use client";

import Link from "next/link";
import { Flame, Play } from "lucide-react";
import type { Post } from "@/types/post";
import { SECTIONS } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { TagBadge } from "@/components/shared/tag-badge";
import { parseVideoUrl } from "@/lib/video";

interface CSS3DCardProps {
  post: Post;
  size?: "standard" | "large";
}

export function CSS3DCard({ post, size = "standard" }: CSS3DCardProps) {
  const { t } = useI18n();
  const section = SECTIONS[post.sectionId];
  const video = post.videoUrl ? parseVideoUrl(post.videoUrl) : null;

  return (
    <Link
      href={`/post/${post.id}`}
      className="card-shell card-shine block rounded-xl overflow-hidden h-full"
    >
      <div className={`relative ${size === "large" ? "h-44" : "h-28"}`}>
        {video?.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: post.coverGradient }} />
        )}
        {video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
        )}
        {post.isHot && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-bb-amber/90 text-[10px] font-bold text-bb-surface-0">
            <Flame className="h-3 w-3" />
            HOT
          </div>
        )}
      </div>
      <div className="p-3 space-y-2 bg-bb-surface-1/90">
        <h3 className={`font-semibold text-bb-text-1 line-clamp-2 leading-tight ${size === "large" ? "text-base" : "text-sm"}`}>
          {post.title}
        </h3>
        {size === "large" && (
          <p className="text-xs text-bb-text-2 line-clamp-2">{post.summary}</p>
        )}
        <TagBadge label={t(section.nameKey)} color={section.color} />
        <div className="flex items-center gap-1.5">
          <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="sm" />
          <span className="text-xs text-bb-text-3 truncate max-w-[80px]">{post.author.name}</span>
        </div>
      </div>
    </Link>
  );
}

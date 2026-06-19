"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import type { Post } from "@/types/post";
import { SECTIONS } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { TagBadge } from "@/components/shared/tag-badge";

interface CSS3DCardProps {
  post: Post;
  size?: "standard" | "large";
  stagger?: number;
}

export function CSS3DCard({ post, size = "standard", stagger = 0 }: CSS3DCardProps) {
  const { t } = useI18n();
  const section = SECTIONS[post.sectionId];
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const hoverRotate = hovered ? 8 : stagger;
  const hoverLift = hovered ? 30 : 0;
  const hoverScale = hovered ? 1.05 : 1;

  return (
    <div
      className="group"
      style={{
        perspective: "1200px",
        transform: `translateY(${stagger}px)`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (flipped) setFlipped(false); }}
    >
      <div
        style={{
          transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms ease",
          transformStyle: "preserve-3d",
          transform: flipped
            ? "rotateY(180deg)"
            : `translateZ(${hoverLift}px) rotateY(${hoverRotate}deg) scale(${hoverScale})`,
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front face */}
        <div style={{ backfaceVisibility: "hidden" }}>
          <div className={`rounded-card bg-bb-surface-1 border border-bb-border overflow-hidden shadow-bb-card ${hovered ? "shadow-bb-elevated" : ""} transition-shadow duration-300`}>
            <div className={size === "large" ? "h-44" : "h-28"} style={{ background: post.coverGradient }} />
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-1.5">
                {post.isHot && <Flame className="h-3.5 w-3.5 text-bb-amber flex-shrink-0 mt-0.5" />}
                <h3 className={`font-semibold text-bb-text-1 line-clamp-2 leading-tight ${size === "large" ? "text-base" : "text-sm"}`}>
                  {post.title}
                </h3>
              </div>
              {size === "large" && (
                <p className="text-xs text-bb-text-2 line-clamp-2">{post.summary}</p>
              )}
              <TagBadge label={t(section.nameKey)} color={section.color} />
              <div className="flex items-center gap-1.5">
                <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="sm" />
                <span className="text-xs text-bb-text-3 truncate max-w-[80px]">{post.author.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back face */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
        >
          <div className="rounded-card bg-bb-surface-1 border border-bb-border overflow-hidden shadow-bb-card h-full p-4 flex flex-col items-center justify-center gap-2">
            <TagBadge label={t(section.nameKey)} color={section.color} />
            <h3 className="text-base font-bold text-bb-text-1 text-center line-clamp-3">{post.title}</h3>
            <p className="text-xs text-bb-text-2 text-center line-clamp-3">{post.summary}</p>
            <Link href={`/post/${post.id}`} className="rounded-button bg-bb-amber px-4 py-2 text-sm font-bold text-bb-surface-0 shadow-bb-button">
              查看详情
            </Link>
            <button onClick={(e) => { e.stopPropagation(); setFlipped(false); }} className="text-xs text-bb-text-3 hover:text-bb-amber transition-colors">
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

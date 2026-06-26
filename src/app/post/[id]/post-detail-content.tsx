"use client";

import { Share2, MessageCircle } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { GradientCover } from "@/components/shared/gradient-cover";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { LikeButton } from "@/components/post/like-button";
import { BookmarkButton } from "@/components/post/bookmark-button";
import { TagBadge } from "@/components/shared/tag-badge";
import { useI18n } from "@/i18n/provider";
import { usePosts } from "@/hooks/use-posts";
import { getCommentsByPostId } from "@/data/mock-comments";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { parseVideoUrl } from "@/lib/video";

export function PostDetailContent({ postId }: { postId: string }) {
  const { t } = useI18n();
  const [commentTab, setCommentTab] = useState<"analysis" | "hot">("hot");
  const { singlePost: post, loading } = usePosts({ type: "single", postId });

  if (loading) {
    return (
      <ResponsiveShell showBack>
        <div className="flex items-center justify-center py-20 text-bb-text-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-bb-amber border-t-transparent" />
        </div>
      </ResponsiveShell>
    );
  }

  if (!post) {
    return (
      <ResponsiveShell showBack>
        <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
          帖子不存在
        </div>
      </ResponsiveShell>
    );
  }

  const section = SECTIONS[post.sectionId];
  const comments = getCommentsByPostId(postId);
  const filteredComments =
    commentTab === "analysis"
      ? comments.filter((c) => c.isAnalysis)
      : [...comments].sort((a, b) => b.likes - a.likes);

  return (
    <ResponsiveShell showBack>
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        {post.videoUrl && parseVideoUrl(post.videoUrl) ? (
          <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={parseVideoUrl(post.videoUrl)!.embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title}
            />
          </div>
        ) : (
          <GradientCover gradient={post.coverGradient} aspectRatio={post.coverAspectRatio * 0.7} className="rounded-card" />
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TagBadge label={t(section.nameKey)} color={section.color} />
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} label={`#${tag}`} />
            ))}
          </div>

          <h1 className="text-xl font-bold text-bb-text-1 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-3">
            <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="md" />
            <div>
              <p className="text-sm font-medium text-bb-text-1">{post.author.name}</p>
              <p className="text-[10px] text-bb-text-3">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-bb-text-2 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {post.poll && (
          <div className="rounded-card bg-bb-surface-1 border border-bb-border p-4 space-y-3">
            <h3 className="text-sm font-bold text-bb-text-1">{post.poll.question}</h3>
            {post.poll.options.map((opt) => {
              const totalVotes = post.poll!.options.reduce((sum, o) => sum + o.votes, 0);
              const percentage = Math.round((opt.votes / totalVotes) * 100);
              return (
                <button key={opt.id} className="relative w-full rounded-button bg-bb-surface-2 p-3 text-left overflow-hidden hover:bg-bb-surface-3 transition-colors">
                  <div className="absolute inset-0 bg-bb-amber/15" style={{ width: `${percentage}%` }} />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm text-bb-text-1">{opt.text}</span>
                    <span className="text-xs text-bb-text-3">{percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-around py-3 border-y border-bb-border">
          <LikeButton postId={post.id} initialCount={post.stats.likes} size="md" />
          <BookmarkButton postId={post.id} initialCount={post.stats.bookmarks} />
          <div className="flex items-center gap-1">
            <MessageCircle className="h-5 w-5 text-bb-text-3" />
            <span className="text-xs text-bb-text-3">{post.stats.comments}</span>
          </div>
          <button className="flex items-center gap-1">
            <Share2 className="h-5 w-5 text-bb-text-3" />
            <span className="text-xs text-bb-text-3">{t("post.shares")}</span>
          </button>
        </div>

        <div>
          <div className="flex gap-6 py-2 border-b border-bb-border">
            <button onClick={() => setCommentTab("hot")} className={cn("relative text-sm py-2 transition-colors", commentTab === "hot" ? "text-bb-text-1 font-medium" : "text-bb-text-3")}>
              {t("post.hotComments")}
              {commentTab === "hot" && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full metallic-gradient" />}
            </button>
            <button onClick={() => setCommentTab("analysis")} className={cn("relative text-sm py-2 transition-colors", commentTab === "analysis" ? "text-bb-text-1 font-medium" : "text-bb-text-3")}>
              {t("post.rationalAnalysis")}
              {commentTab === "analysis" && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full metallic-gradient" />}
            </button>
          </div>

          <div className="divide-y divide-bb-border">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="py-3 space-y-2">
                <div className="flex items-start gap-3">
                  <GradientAvatar color={comment.author.avatarColor} initial={comment.author.avatarInitial} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-bb-text-1">{comment.author.name}</span>
                      {comment.isAnalysis && <span className="rounded-badge bg-bb-section-awareness/20 px-1.5 py-0.5 text-[9px] text-bb-section-awareness font-medium">理性</span>}
                    </div>
                    <p className="text-sm text-bb-text-2 mt-1">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-[10px] text-bb-text-3 hover:text-bb-amber transition-colors">{comment.likes} 赞</button>
                      <button className="text-[10px] text-bb-text-3 hover:text-bb-amber transition-colors">{t("post.reply")}</button>
                      <span className="text-[10px] text-bb-text-3">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {comment.replies.length > 0 && (
                  <div className="ml-9 space-y-2 mt-2 pl-3 border-l border-bb-border">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <GradientAvatar color={reply.author.avatarColor} initial={reply.author.avatarInitial} size="sm" />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-bb-text-1">{reply.author.name}</span>
                          <p className="text-xs text-bb-text-2 mt-0.5">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredComments.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-bb-text-3">
              暂无评论
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input placeholder={t("post.writeComment")} className="flex-1 rounded-lg bg-bb-surface-2 px-3 py-2.5 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber" />
          <button className="rounded-button bg-bb-amber px-4 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button">发送</button>
        </div>
      </div>
    </ResponsiveShell>
  );
}

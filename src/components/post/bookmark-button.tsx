"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInteractionStore } from "@/stores/interaction-store";

interface BookmarkButtonProps {
  postId: string;
  initialCount: number;
  showCount?: boolean;
  className?: string;
}

export function BookmarkButton({ postId, initialCount, showCount = true, className }: BookmarkButtonProps) {
  const { toggleBookmark, isBookmarked } = useInteractionStore();
  const bookmarked = isBookmarked(postId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(postId);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button onClick={handleClick} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={bookmarked ? "bookmarked" : "not-bookmarked"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Bookmark
              className={cn(
                "h-5 w-5 transition-colors",
                bookmarked
                  ? "fill-bb-gold text-bb-gold"
                  : "text-bb-text-3 hover:text-bb-gold"
              )}
              strokeWidth={2}
            />
          </motion.div>
        </AnimatePresence>
      </button>
      {showCount && (
        <span className={cn(
          "text-xs tabular-nums",
          bookmarked ? "text-bb-gold" : "text-bb-text-3"
        )}>
          {initialCount + (bookmarked ? 1 : 0)}
        </span>
      )}
    </div>
  );
}

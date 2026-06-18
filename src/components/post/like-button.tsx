"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInteractionStore } from "@/stores/interaction-store";
import { particleBurst } from "@/lib/animations";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  showCount?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function LikeButton({ postId, initialCount, showCount = true, size = "sm", className }: LikeButtonProps) {
  const { toggleLike, isLiked, getLikeDelta } = useInteractionStore();
  const [showParticles, setShowParticles] = useState(false);
  const liked = isLiked(postId);
  const delta = getLikeDelta(postId);
  const count = initialCount + delta;

  const burst = particleBurst(8);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
    }
    toggleLike(postId);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              "transition-colors",
              size === "sm" ? "h-4 w-4" : "h-5 w-5",
              liked
                ? "fill-bb-amber text-bb-amber"
                : "text-bb-text-3 hover:text-bb-amber"
            )}
            strokeWidth={2}
          />
        </motion.div>

        <AnimatePresence>
          {showParticles && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={burst}
                  initial="initial"
                  animate="animate"
                  className="absolute h-1.5 w-1.5 bg-bb-amber rounded-sm"
                  style={{ top: "50%", left: "50%", marginTop: -3, marginLeft: -3 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </button>

      {showCount && (
        <span className={cn(
          "text-xs tabular-nums",
          liked ? "text-bb-amber" : "text-bb-text-3"
        )}>
          {count}
        </span>
      )}
    </div>
  );
}

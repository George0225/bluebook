"use client";

import type { Post } from "@/types/post";
import { FeedCard } from "./feed-card";

interface IndustrialGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

export function IndustrialGrid({ posts, columns = 3 }: IndustrialGridProps) {
  const getCardSize = (index: number): "standard" | "large" => {
    const patternPos = index % 9;
    const largePositions = [2, 4, 8];
    return largePositions.includes(patternPos) ? "large" : "standard";
  };

  const getRowSpan = (index: number): string => {
    return getCardSize(index) === "large" ? "row-span-2" : "";
  };

  return (
    <div
      className="grid gap-3 px-4 py-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(120px, auto)",
      }}
    >
      {posts.map((post, index) => (
        <div key={post.id} className={getRowSpan(index)}>
          <FeedCard post={post} size={getCardSize(index)} />
        </div>
      ))}
    </div>
  );
}

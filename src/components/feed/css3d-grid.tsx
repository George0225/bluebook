"use client";

import type { Post } from "@/types/post";
import { CSS3DCard } from "./css3d-card";

interface CSS3DGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

export function CSS3DGrid({ posts, columns = 3 }: CSS3DGridProps) {
  const getSize = (i: number) => {
    const pos = i % 9;
    return [2, 4, 8].includes(pos) ? "large" : "standard";
  };

  return (
    <div className="px-4 py-6">
      <div
        className="grid gap-3.5"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: "minmax(120px, auto)",
        }}
      >
        {posts.map((post, i) => {
          const size = getSize(i);
          return (
            <div
              key={post.id}
              className={`reveal-in ${size === "large" ? "row-span-2" : ""}`}
              style={{ animationDelay: `${((i % 9) + 1) * 0.05}s` }}
            >
              <CSS3DCard post={post} size={size} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

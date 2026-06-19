"use client";

import type { Post } from "@/types/post";
import { CSS3DCard } from "./css3d-card";

interface CSS3DGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

const staggerPatterns3 = [0, -14, 10, 18, -10, 14, 0, -18, 10];
const staggerPatterns2 = [0, -14, 10, -10, 18, 0];

export function CSS3DGrid({ posts, columns = 3 }: CSS3DGridProps) {
  const getSize = (i: number) => {
    const pos = i % 9;
    return [2, 4, 8].includes(pos) ? "large" : "standard";
  };

  const getStagger = (i: number) => {
    const pattern = columns === 3 ? staggerPatterns3 : staggerPatterns2;
    return pattern[i % pattern.length];
  };

  return (
    <div className="px-4 py-6">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: "minmax(120px, auto)",
          gap: "14px",
        }}
      >
        {posts.map((post, i) => {
          const size = getSize(i);
          return (
            <div
              key={post.id}
              className={size === "large" ? "row-span-2" : ""}
            >
              <CSS3DCard
                post={post}
                size={size}
                stagger={getStagger(i)}
                index={i}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

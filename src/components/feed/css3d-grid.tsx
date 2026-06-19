"use client";

import type { Post } from "@/types/post";
import { CSS3DCard } from "./css3d-card";

interface CSS3DGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

const staggerPatterns3 = [0, -12, 8, 16, -8, 12, 0, -16, 8];
const staggerPatterns2 = [0, -12, 8, -8, 16, 0];
const rotPatterns3 = [0, -2, 3, -1, 2, 1, 0, -3, 2];
const rotPatterns2 = [0, -2, 3, -1, 2, 1];

export function CSS3DGrid({ posts, columns = 3 }: CSS3DGridProps) {
  const getSize = (i: number) => {
    const pos = i % 9;
    return [2, 4, 8].includes(pos) ? "large" : "standard";
  };

  const getStagger = (i: number) => {
    const pattern = columns === 3 ? staggerPatterns3 : staggerPatterns2;
    return pattern[i % pattern.length];
  };

  const getRotate = (i: number) => {
    const pattern = columns === 3 ? rotPatterns3 : rotPatterns2;
    return pattern[i % pattern.length];
  };

  return (
    <div className="px-4 py-4">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: "minmax(120px, auto)",
          gap: "12px",
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

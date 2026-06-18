import { mockPosts } from "@/data/mock-posts";
import { PostDetailContent } from "./post-detail-content";
import { use } from "react";

export function generateStaticParams() {
  return mockPosts.map((post) => ({
    id: post.id,
  }));
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PostDetailContent postId={id} />;
}

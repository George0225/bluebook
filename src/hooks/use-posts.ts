"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { fetchAllPosts, fetchPostsBySection, fetchHotPosts, fetchPostById } from "@/lib/api";
import type { Post, SectionId } from "@/types/post";

type FetchType = "all" | "section" | "hot" | "single";

interface UsePostsOptions {
  type: FetchType;
  sectionId?: SectionId;
  postId?: string;
  enableRealtime?: boolean;
}

interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  singlePost?: Post;
}

export function usePosts({ type, sectionId, postId, enableRealtime = true }: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [singlePost, setSinglePost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        if (type === "all") {
          const data = await fetchAllPosts();
          if (!cancelled) setPosts(data);
        } else if (type === "section" && sectionId) {
          const data = await fetchPostsBySection(sectionId);
          if (!cancelled) setPosts(data);
        } else if (type === "hot") {
          const data = await fetchHotPosts();
          if (!cancelled) setPosts(data);
        } else if (type === "single" && postId) {
          const data = await fetchPostById(postId);
          if (!cancelled) setSinglePost(data);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [type, sectionId, postId, refreshKey]);

  useEffect(() => {
    if (!enableRealtime || !isSupabaseConfigured || !supabase) return;

    const client = supabase;
    const channel = client
      .channel("posts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        refresh();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [enableRealtime, refresh]);

  return { posts, loading, error, refresh, singlePost };
}

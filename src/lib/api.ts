import { supabase, isSupabaseConfigured } from "./supabase";
import { mockPosts, getPostsBySection, getHotPosts, getPostById as getMockPostById } from "@/data/mock-posts";
import type { Post, SectionId, PostType, Poll } from "@/types/post";

interface SupabasePost {
  id: string;
  type: string;
  section_id: string;
  author_id: string;
  author_name: string;
  author_avatar_color: string;
  author_avatar_initial: string;
  title: string;
  summary: string;
  content: string;
  cover_gradient: string;
  cover_aspect_ratio: number;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  is_hot: boolean;
  is_featured: boolean;
  poll: Poll | null;
  created_at: string;
  video_url: string | null;
}

function mapSupabasePost(row: SupabasePost): Post {
  return {
    id: row.id,
    type: row.type as PostType,
    sectionId: row.section_id as SectionId,
    author: {
      id: row.author_id,
      name: row.author_name,
      avatarColor: row.author_avatar_color,
      avatarInitial: row.author_avatar_initial,
    },
    title: row.title,
    summary: row.summary,
    content: row.content,
    coverGradient: row.cover_gradient,
    coverAspectRatio: row.cover_aspect_ratio,
    images: row.images || [],
    tags: row.tags || [],
    stats: {
      likes: row.likes,
      comments: row.comments,
      bookmarks: row.bookmarks,
      shares: row.shares,
    },
    isHot: row.is_hot,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    poll: row.poll || undefined,
    videoUrl: row.video_url || undefined,
  };
}

export async function fetchAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockPosts;
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.warn("Supabase fetch failed, falling back to mock data:", error);
    return mockPosts;
  }
  return (data as SupabasePost[]).map(mapSupabasePost);
}

export async function fetchPostsBySection(sectionId: SectionId): Promise<Post[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getPostsBySection(sectionId);
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("section_id", sectionId)
    .order("created_at", { ascending: false });
  if (error || !data) {
    console.warn("Supabase fetch failed, falling back to mock data:", error);
    return getPostsBySection(sectionId);
  }
  return (data as SupabasePost[]).map(mapSupabasePost);
}

export async function fetchHotPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getHotPosts();
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_hot", true)
    .order("likes", { ascending: false });
  if (error || !data) {
    console.warn("Supabase fetch failed, falling back to mock data:", error);
    return getHotPosts();
  }
  return (data as SupabasePost[]).map(mapSupabasePost);
}

export async function fetchPostById(id: string): Promise<Post | undefined> {
  if (!isSupabaseConfigured || !supabase) {
    return getMockPostById(id);
  }
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    console.warn("Supabase fetch failed, falling back to mock data:", error);
    return getMockPostById(id);
  }
  return mapSupabasePost(data as SupabasePost);
}

export interface CreatePostInput {
  type?: PostType;
  sectionId: SectionId;
  authorId: string;
  authorName: string;
  authorAvatarColor: string;
  authorAvatarInitial: string;
  title: string;
  summary: string;
  content?: string;
  coverGradient: string;
  tags?: string[];
  isHot?: boolean;
  isFeatured?: boolean;
  poll?: Poll;
}

export async function createPost(input: CreatePostInput): Promise<Post | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("posts")
    .insert({
      type: input.type || "image-text",
      section_id: input.sectionId,
      author_id: input.authorId,
      author_name: input.authorName,
      author_avatar_color: input.authorAvatarColor,
      author_avatar_initial: input.authorAvatarInitial,
      title: input.title,
      summary: input.summary,
      content: input.content || "",
      cover_gradient: input.coverGradient,
      cover_aspect_ratio: 1.0,
      images: [],
      tags: input.tags || [],
      likes: 0,
      comments: 0,
      bookmarks: 0,
      shares: 0,
      is_hot: input.isHot || false,
      is_featured: input.isFeatured || false,
      poll: input.poll || null,
    })
    .select()
    .single();
  if (error || !data) {
    console.error("Failed to create post:", error);
    return null;
  }
  return mapSupabasePost(data as SupabasePost);
}

export async function deletePost(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete post:", error);
    return false;
  }
  return true;
}

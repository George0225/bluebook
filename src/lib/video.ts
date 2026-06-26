export interface VideoInfo {
  platform: "youtube" | "bilibili";
  embedUrl: string;
  thumbnailUrl: string | null;
}

export function parseVideoUrl(url: string): VideoInfo | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const bvMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (bvMatch) {
    const bvid = bvMatch[1];
    return {
      platform: "bilibili",
      embedUrl: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0&high_quality=1`,
      thumbnailUrl: null,
    };
  }

  return null;
}

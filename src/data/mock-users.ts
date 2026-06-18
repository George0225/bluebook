import type { UserRef } from "@/types/post";
import type { User } from "@/types/user";

const userRefs: UserRef[] = [
  { id: "u1", name: "钢铁侠不穿铁", avatarColor: "linear-gradient(135deg, #E8782A, #B8963E)", avatarInitial: "钢" },
  { id: "u2", name: "健身老王", avatarColor: "linear-gradient(135deg, #4A5D4E, #2C3040)", avatarInitial: "王" },
  { id: "u3", name: "理财小哥Max", avatarColor: "linear-gradient(135deg, #B8963E, #E8782A)", avatarInitial: "M" },
  { id: "u4", name: "游戏达人阿飞", avatarColor: "linear-gradient(135deg, #7B68EE, #5B9BD5)", avatarInitial: "飞" },
  { id: "u5", name: "清醒观察者", avatarColor: "linear-gradient(135deg, #5B9BD5, #7B68EE)", avatarInitial: "清" },
  { id: "u6", name: "硬核厨神", avatarColor: "linear-gradient(135deg, #E8782A, #4A5D4E)", avatarInitial: "厨" },
  { id: "u7", name: "数码测评师Leo", avatarColor: "linear-gradient(135deg, #2C3040, #5B9BD5)", avatarInitial: "L" },
  { id: "u8", name: "社交心理学博士", avatarColor: "linear-gradient(135deg, #7B68EE, #B8963E)", avatarInitial: "博" },
  { id: "u9", name: "老司机开车了", avatarColor: "linear-gradient(135deg, #4A5D4E, #E8782A)", avatarInitial: "司" },
  { id: "u10", name: "心智成长营", avatarColor: "linear-gradient(135deg, #5B9BD5, #4A5D4E)", avatarInitial: "心" },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "钢铁侠不穿铁",
    handle: "iron_without_suit",
    bio: "28岁，互联网打工人。分享职场认知、情感避坑、生活干货。不贩卖焦虑，只说真话。",
    avatarColor: "linear-gradient(135deg, #E8782A, #B8963E)",
    avatarInitial: "钢",
    stats: { posts: 128, likes: 24500, bookmarks: 8900, followers: 12300, following: 256, influenceScore: 856 },
    achievements: [
      { id: "a1", name: "硬核创作者", description: "累计发布100篇优质内容", icon: "PenTool", earnedAt: "2025-12-01", rarity: "epic" },
      { id: "a2", name: "万人迷", description: "获得10000个赞", icon: "Heart", earnedAt: "2025-11-15", rarity: "rare" },
      { id: "a3", name: "社交达人", description: "粉丝突破10000", icon: "Users", earnedAt: "2026-01-10", rarity: "epic" },
      { id: "a4", name: "连续创作者", description: "连续30天发布内容", icon: "Flame", earnedAt: "2025-10-20", rarity: "rare" },
    ],
    joinedAt: "2025-03-15",
    sections: ["awareness", "social", "gaming"],
  },
  {
    id: "u2",
    name: "健身老王",
    handle: "gym_wang",
    bio: "5年自然健身，不卖课不带货。分享真实的训练和饮食经验。三大项总成绩600kg。",
    avatarColor: "linear-gradient(135deg, #4A5D4E, #2C3040)",
    avatarInitial: "王",
    stats: { posts: 89, likes: 18200, bookmarks: 12400, followers: 8900, following: 120, influenceScore: 742 },
    achievements: [
      { id: "a5", name: "铁馆之王", description: "健身板块贡献50篇内容", icon: "Dumbbell", earnedAt: "2025-09-01", rarity: "epic" },
      { id: "a6", name: "知识分享者", description: "内容被收藏超过10000次", icon: "Bookmark", earnedAt: "2025-12-20", rarity: "epic" },
    ],
    joinedAt: "2025-01-10",
    sections: ["fitness"],
  },
  {
    id: "u3",
    name: "理财小哥Max",
    handle: "finance_max",
    bio: "前银行从业者，现自由投资者。分享真实的理财经验和踩坑记录。不推荐具体产品。",
    avatarColor: "linear-gradient(135deg, #B8963E, #E8782A)",
    avatarInitial: "M",
    stats: { posts: 67, likes: 15800, bookmarks: 9200, followers: 7600, following: 89, influenceScore: 698 },
    achievements: [
      { id: "a7", name: "搞钱达人", description: "搞钱板块贡献30篇内容", icon: "TrendingUp", earnedAt: "2025-11-01", rarity: "rare" },
      { id: "a8", name: "避坑专家", description: "发布10篇高质量避坑指南", icon: "Shield", earnedAt: "2025-10-15", rarity: "rare" },
    ],
    joinedAt: "2025-04-20",
    sections: ["finance"],
  },
  {
    id: "u4",
    name: "游戏达人阿飞",
    handle: "gamer_fei",
    bio: "全平台玩家，主机+PC双修。攻略评测爱好者，帮你少走弯路。",
    avatarColor: "linear-gradient(135deg, #7B68EE, #5B9BD5)",
    avatarInitial: "飞",
    stats: { posts: 156, likes: 32100, bookmarks: 15600, followers: 18200, following: 340, influenceScore: 923 },
    achievements: [
      { id: "a9", name: "攻略大师", description: "发布50篇深度游戏攻略", icon: "Gamepad2", earnedAt: "2025-08-01", rarity: "legendary" },
      { id: "a10", name: "社区之星", description: "影响力评分突破900", icon: "Star", earnedAt: "2026-01-05", rarity: "legendary" },
      { id: "a11", name: "热门作者", description: "单篇内容获得1000+赞", icon: "TrendingUp", earnedAt: "2025-07-20", rarity: "epic" },
    ],
    joinedAt: "2025-02-01",
    sections: ["gaming"],
  },
  {
    id: "u5",
    name: "清醒观察者",
    handle: "sober_observer",
    bio: "社会学研究生。用学术视角拆解日常生活中的社交套路和情感陷阱。",
    avatarColor: "linear-gradient(135deg, #5B9BD5, #7B68EE)",
    avatarInitial: "清",
    stats: { posts: 45, likes: 9800, bookmarks: 6700, followers: 5400, following: 78, influenceScore: 567 },
    achievements: [
      { id: "a12", name: "清醒先锋", description: "清醒学堂板块贡献20篇内容", icon: "Shield", earnedAt: "2025-12-15", rarity: "rare" },
    ],
    joinedAt: "2025-06-01",
    sections: ["awareness", "social"],
  },
  {
    id: "u6",
    name: "硬核厨神",
    handle: "hardcore_chef",
    bio: "业余厨师，专注硬菜和烧烤。让每个兄弟都能做一桌好菜。",
    avatarColor: "linear-gradient(135deg, #E8782A, #4A5D4E)",
    avatarInitial: "厨",
    stats: { posts: 34, likes: 7200, bookmarks: 5100, followers: 3200, following: 45, influenceScore: 412 },
    achievements: [
      { id: "a13", name: "新手上路", description: "发布第一篇内容", icon: "PenTool", earnedAt: "2025-08-10", rarity: "common" },
    ],
    joinedAt: "2025-07-15",
    sections: ["gaming", "fitness"],
  },
  {
    id: "u7",
    name: "数码测评师Leo",
    handle: "tech_leo",
    bio: "科技媒体从业者，数码产品深度评测。只说真话，不恰饭。",
    avatarColor: "linear-gradient(135deg, #2C3040, #5B9BD5)",
    avatarInitial: "L",
    stats: { posts: 78, likes: 14300, bookmarks: 8100, followers: 9800, following: 156, influenceScore: 734 },
    achievements: [
      { id: "a14", name: "评测达人", description: "发布30篇数码评测", icon: "Monitor", earnedAt: "2025-11-20", rarity: "epic" },
      { id: "a15", name: "万人迷", description: "获得10000个赞", icon: "Heart", earnedAt: "2025-10-05", rarity: "rare" },
    ],
    joinedAt: "2025-03-01",
    sections: ["gaming", "finance"],
  },
  {
    id: "u8",
    name: "社交心理学博士",
    handle: "dr_social",
    bio: "心理学博士，专注社交行为研究。帮你读懂社交信号，避免被套路。",
    avatarColor: "linear-gradient(135deg, #7B68EE, #B8963E)",
    avatarInitial: "博",
    stats: { posts: 56, likes: 11200, bookmarks: 7800, followers: 6700, following: 92, influenceScore: 645 },
    achievements: [
      { id: "a16", name: "社交观察者", description: "社交观察室板块贡献30篇内容", icon: "Search", earnedAt: "2025-12-01", rarity: "epic" },
    ],
    joinedAt: "2025-05-10",
    sections: ["social", "awareness"],
  },
  {
    id: "u9",
    name: "老司机开车了",
    handle: "driver_veteran",
    bio: "15年驾龄，从家用车到赛道都玩过。分享用车经验和驾驶技巧。",
    avatarColor: "linear-gradient(135deg, #4A5D4E, #E8782A)",
    avatarInitial: "司",
    stats: { posts: 42, likes: 8900, bookmarks: 4500, followers: 4100, following: 67, influenceScore: 489 },
    achievements: [
      { id: "a17", name: "老司机", description: "发布20篇驾驶相关内容", icon: "Car", earnedAt: "2025-11-10", rarity: "rare" },
    ],
    joinedAt: "2025-06-20",
    sections: ["gaming", "fitness"],
  },
  {
    id: "u10",
    name: "心智成长营",
    handle: "mind_growth",
    bio: "心理咨询师，关注男性心理健康。去污名化，让每个兄弟都能正视自己。",
    avatarColor: "linear-gradient(135deg, #5B9BD5, #4A5D4E)",
    avatarInitial: "心",
    stats: { posts: 38, likes: 6500, bookmarks: 4200, followers: 3800, following: 54, influenceScore: 456 },
    achievements: [
      { id: "a18", name: "心智导师", description: "心智训练营板块贡献20篇内容", icon: "Brain", earnedAt: "2025-12-20", rarity: "rare" },
    ],
    joinedAt: "2025-08-01",
    sections: ["awareness", "fitness"],
  },
];

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getUserRefById(id: string): UserRef | undefined {
  return userRefs.find((u) => u.id === id);
}

export const currentUser = mockUsers[0];

import type { Notification } from "@/types/notification";

const actors = [
  { id: "u2", name: "健身老王", avatarColor: "linear-gradient(135deg, #4A5D4E, #2C3040)", avatarInitial: "王" },
  { id: "u4", name: "游戏达人阿飞", avatarColor: "linear-gradient(135deg, #7B68EE, #5B9BD5)", avatarInitial: "飞" },
  { id: "u5", name: "清醒观察者", avatarColor: "linear-gradient(135deg, #5B9BD5, #7B68EE)", avatarInitial: "清" },
  { id: "u8", name: "社交心理学博士", avatarColor: "linear-gradient(135deg, #7B68EE, #B8963E)", avatarInitial: "博" },
];

function timeAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    actor: actors[0],
    postRef: { id: "post-1", title: "她说'随便'其实一点都不随便" },
    message: "赞了你的帖子",
    read: false,
    createdAt: timeAgo(1),
  },
  {
    id: "n2",
    type: "comment",
    actor: actors[3],
    postRef: { id: "post-1", title: "她说'随便'其实一点都不随便" },
    message: "评论了你的帖子：\"分析得很到位，特别是关于服从性测试那部分\"",
    read: false,
    createdAt: timeAgo(2),
  },
  {
    id: "n3",
    type: "follow",
    actor: actors[1],
    message: "关注了你",
    read: false,
    createdAt: timeAgo(3),
  },
  {
    id: "n4",
    type: "achievement",
    message: "恭喜获得成就徽章「硬核创作者」！",
    read: true,
    createdAt: timeAgo(24),
  },
  {
    id: "n5",
    type: "like",
    actor: actors[2],
    postRef: { id: "post-2", title: "红牌警示：这8种行为模式说明你正在被操控" },
    message: "赞了你的帖子",
    read: true,
    createdAt: timeAgo(48),
  },
  {
    id: "n6",
    type: "system",
    message: "你的帖子「她说'随便'其实一点都不随便」已进入热门推荐",
    read: true,
    createdAt: timeAgo(72),
  },
  {
    id: "n7",
    type: "comment",
    actor: actors[0],
    postRef: { id: "post-4", title: "'这正常吗？' — 女友要求我每月工资全上交" },
    message: "评论了你的帖子：\"3个月就要工资卡？这也太快了吧\"",
    read: true,
    createdAt: timeAgo(96),
  },
  {
    id: "n8",
    type: "follow",
    actor: actors[3],
    message: "关注了你",
    read: true,
    createdAt: timeAgo(120),
  },
  {
    id: "n9",
    type: "like",
    actor: actors[1],
    postRef: { id: "post-5", title: "识别PUA话术：从入门到精通的防身手册" },
    message: "赞了你的帖子",
    read: true,
    createdAt: timeAgo(144),
  },
  {
    id: "n10",
    type: "system",
    message: "社区公约更新：请查看最新的社区规范",
    read: true,
    createdAt: timeAgo(168),
  },
];

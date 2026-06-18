import type { Conversation } from "@/types/message";

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    user: { id: "u2", name: "健身老王", avatarColor: "linear-gradient(135deg, #4A5D4E, #2C3040)", avatarInitial: "王" },
    lastMessage: "好的兄弟，周末健身房见！",
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      { id: "m1", senderId: "u2", content: "兄弟，你那个深蹲计划确实有效，我4周涨了15kg", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "m2", senderId: "u1", content: "哈哈，坚持就行。注意膝盖别受伤", createdAt: new Date(Date.now() - 82800000).toISOString() },
      { id: "m3", senderId: "u2", content: "对了，周末要不要一起去健身房？我发现一家新开的铁馆", createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: "m4", senderId: "u1", content: "可以啊，周六下午怎么样？", createdAt: new Date(Date.now() - 5400000).toISOString() },
      { id: "m5", senderId: "u2", content: "好的兄弟，周末健身房见！", createdAt: new Date(Date.now() - 3600000).toISOString() },
    ],
  },
  {
    id: "conv2",
    user: { id: "u4", name: "游戏达人阿飞", avatarColor: "linear-gradient(135deg, #7B68EE, #5B9BD5)", avatarInitial: "飞" },
    lastMessage: "今晚打不打Valorant？缺一个控场的",
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    messages: [
      { id: "m6", senderId: "u4", content: "你那篇攻略写得真不错，我照着你说的打DLC快多了", createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: "m7", senderId: "u1", content: "谢谢！有问题随时问", createdAt: new Date(Date.now() - 169200000).toISOString() },
      { id: "m8", senderId: "u4", content: "今晚打不打Valorant？缺一个控场的", createdAt: new Date(Date.now() - 7200000).toISOString() },
    ],
  },
  {
    id: "conv3",
    user: { id: "u8", name: "社交心理学博士", avatarColor: "linear-gradient(135deg, #7B68EE, #B8963E)", avatarInitial: "博" },
    lastMessage: "好的，那篇合作文章我下周写完初稿",
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { id: "m9", senderId: "u8", content: "你的清醒学堂系列写得很好，有没有兴趣合作一篇关于社交操控的深度分析？", createdAt: new Date(Date.now() - 259200000).toISOString() },
      { id: "m10", senderId: "u1", content: "当然可以！我很感兴趣", createdAt: new Date(Date.now() - 255600000).toISOString() },
      { id: "m11", senderId: "u8", content: "好的，那篇合作文章我下周写完初稿", createdAt: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
];

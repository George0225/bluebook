import type { UserRef } from "./post";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  user: UserRef;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  messages: Message[];
}

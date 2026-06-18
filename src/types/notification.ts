import type { UserRef } from "./post";

export type NotificationType = "like" | "comment" | "follow" | "system" | "achievement";

export interface Notification {
  id: string;
  type: NotificationType;
  actor?: UserRef;
  postRef?: { id: string; title: string };
  message: string;
  read: boolean;
  createdAt: string;
}

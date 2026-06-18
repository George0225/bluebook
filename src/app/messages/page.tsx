"use client";

import { useState } from "react";
import { MessageCircle, Heart, UserPlus, Bell, Award, Send } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/data/mock-notifications";
import { mockConversations } from "@/data/mock-messages";

type MessageTab = "comments" | "likes" | "system" | "dm";

export default function MessagesPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<MessageTab>("comments");
  const [selectedConv, setSelectedConv] = useState<string | null>(null);

  const tabs: { id: MessageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "comments", label: t("messages.comments"), icon: MessageCircle },
    { id: "likes", label: t("messages.likes"), icon: Heart },
    { id: "system", label: t("messages.system"), icon: Bell },
    { id: "dm", label: t("messages.directMessages"), icon: UserPlus },
  ];

  const filteredNotifications = mockNotifications.filter((n) => {
    if (activeTab === "comments") return n.type === "comment";
    if (activeTab === "likes") return n.type === "like" || n.type === "follow";
    if (activeTab === "system") return n.type === "system" || n.type === "achievement";
    return false;
  });

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  return (
    <ResponsiveShell title={t("nav.messages")}>
      <div className="max-w-2xl mx-auto">
        <div className="flex overflow-x-auto hide-scrollbar border-b border-bb-border px-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedConv(null); }}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-xs font-medium transition-colors border-b-2",
                  isActive
                    ? "text-bb-amber border-bb-amber"
                    : "text-bb-text-3 border-transparent hover:text-bb-text-2"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "dm" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[calc(100vh-120px)]">
            {/* Conversation list */}
            <div className={cn("divide-y divide-bb-border md:col-span-1", selectedConv && "hidden md:block")}>
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-bb-surface-1 transition-colors w-full text-left",
                    selectedConv === conv.id && "bg-bb-surface-2"
                  )}
                >
                  <GradientAvatar
                    color={conv.user.avatarColor}
                    initial={conv.user.avatarInitial}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-bb-text-1">{conv.user.name}</span>
                      <span className="text-[10px] text-bb-text-3">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-bb-text-3 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="h-5 min-w-5 rounded-full bg-bb-amber text-bb-surface-0 text-[10px] font-bold flex items-center justify-center px-1.5">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Chat detail */}
            <div className={cn("md:col-span-2 border-l border-bb-border", !selectedConv && "hidden md:flex md:flex-col")}>
              {selectedConv ? (
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-bb-border flex items-center gap-3">
                    {(() => {
                      const conv = mockConversations.find((c) => c.id === selectedConv);
                      if (!conv) return null;
                      return (
                        <>
                          <GradientAvatar color={conv.user.avatarColor} initial={conv.user.avatarInitial} size="sm" />
                          <span className="text-sm font-medium text-bb-text-1">{conv.user.name}</span>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {(() => {
                      const conv = mockConversations.find((c) => c.id === selectedConv);
                      if (!conv) return null;
                      return conv.messages.map((msg) => (
                        <div key={msg.id} className={cn("flex", msg.senderId === "u1" ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "rounded-lg px-3 py-2 max-w-[70%] text-sm",
                            msg.senderId === "u1" ? "bg-bb-amber text-bb-surface-0" : "bg-bb-surface-2 text-bb-text-1"
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  <div className="p-4 border-t border-bb-border flex items-center gap-3">
                    <input placeholder="输入消息..." className="flex-1 rounded-lg bg-bb-surface-2 px-3 py-2 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none" />
                    <button className="rounded-button bg-bb-amber p-2 text-bb-surface-0 shadow-bb-button">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-bb-text-3">
                  选择一个对话
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-bb-border">
            {filteredNotifications.map((notif) => {
              const notifIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                like: Heart,
                comment: MessageCircle,
                follow: UserPlus,
                system: Bell,
                achievement: Award,
              };
              const Icon = notifIconMap[notif.type] || Bell;

              return (
                <div
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors",
                    !notif.read && "bg-bb-amber/5"
                  )}
                >
                  {notif.actor ? (
                    <GradientAvatar
                      color={notif.actor.avatarColor}
                      initial={notif.actor.avatarInitial}
                      size="md"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-bb-surface-2 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-bb-text-3" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-bb-text-1">
                      {notif.actor && <span className="font-semibold">{notif.actor.name} </span>}
                      {notif.message}
                    </p>
                    {notif.postRef && (
                      <p className="text-xs text-bb-text-3 mt-1 truncate">{notif.postRef.title}</p>
                    )}
                    <p className="text-[10px] text-bb-text-3 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="h-2 w-2 rounded-full bg-bb-amber mt-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            {filteredNotifications.length === 0 && (
              <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
                {t("messages.noMessages")}
              </div>
            )}
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}

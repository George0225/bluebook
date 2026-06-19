"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Compass, PlusSquare, MessageCircle, User,
  Shield, Search, Gamepad2, Dumbbell, TrendingUp,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { currentUser } from "@/data/mock-users";

const mainNav = [
  { id: "home", href: "/", icon: Home, labelKey: "nav.home", isCreate: false, hasBadge: false },
  { id: "discover", href: "/discover", icon: Compass, labelKey: "nav.discover", isCreate: false, hasBadge: false },
  { id: "create", href: "/create", icon: PlusSquare, labelKey: "nav.create", isCreate: true, hasBadge: false },
  { id: "messages", href: "/messages", icon: MessageCircle, labelKey: "nav.messages", isCreate: false, hasBadge: true },
  { id: "profile", href: "/profile", icon: User, labelKey: "nav.profile", isCreate: false, hasBadge: false },
] as const;

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Search, Gamepad2, Dumbbell, TrendingUp,
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const user = currentUser;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 glass-strong flex flex-col z-40 noise-overlay">
      {/* Logo */}
      <div className="relative flex items-center gap-2.5 px-5 h-16 border-b border-white/5">
        <div className="h-8 w-8 rounded-lg bg-bb-amber flex items-center justify-center glow-amber">
          <span className="text-sm font-black text-bb-surface-0">B</span>
        </div>
        <span className="text-base font-bold text-gradient-static">{t("common.appName")}</span>
      </div>

      {/* Primary Navigation */}
      <nav className="relative z-10 flex-1 px-3 py-4 space-y-1">
        {mainNav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isCreate) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-bb-amber to-bb-gold px-4 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:shadow-bb-glow-amber hover:-translate-y-0.5 transition-all duration-300"
              >
                <Icon className="h-5 w-5" strokeWidth={2.5} />
                {t(item.labelKey)}
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-bb-amber bg-bb-amber/10 nav-glow"
                  : "text-bb-text-2 hover:text-bb-text-1 hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1">{t(item.labelKey)}</span>
              {item.hasBadge && (
                <span className="h-5 min-w-5 rounded-full bg-bb-amber text-bb-surface-0 text-[10px] font-bold flex items-center justify-center px-1.5 animate-pulse">
                  3
                </span>
              )}
            </Link>
          );
        })}

        {/* Sections */}
        <div className="pt-4 mt-4 border-t border-white/5">
          <p className="px-4 pb-2 text-[10px] font-semibold text-bb-text-3 uppercase tracking-wider">
            板块
          </p>
          {Object.values(SECTIONS).map((section) => {
            const isActive = pathname === section.route;
            const Icon = sectionIcons[section.icon];
            return (
              <Link
                key={section.id}
                href={section.route}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200 group",
                  isActive
                    ? "text-bb-text-1 bg-white/5"
                    : "text-bb-text-3 hover:text-bb-text-1 hover:bg-white/5"
                )}
              >
                {Icon && (
                  <div
                    className={cn("transition-all duration-200", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100")}
                    style={{ color: section.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <span>{t(section.nameKey)}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: section.color, boxShadow: `0 0 6px ${section.color}` }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Area */}
      <div className="relative z-10 border-t border-white/5 p-4">
        <button className="flex items-center gap-3 w-full rounded-lg px-2 py-2 hover:bg-white/5 transition-all duration-200">
          <GradientAvatar
            color={user.avatarColor}
            initial={user.avatarInitial}
            size="md"
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-bb-text-1 truncate">{user.name}</p>
            <p className="text-[10px] text-bb-text-3">
              {t("profile.influenceScore")} {user.stats.influenceScore}
            </p>
          </div>
          <Settings className="h-4 w-4 text-bb-text-3" />
        </button>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Compass, PlusSquare, MessageCircle, User,
  Shield, Search, Gamepad2, Dumbbell, TrendingUp,
  X,
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

interface SidebarSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SidebarSheet({ open, onClose }: SidebarSheetProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const user = currentUser;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-60 bg-bb-surface-1 border-r border-bb-border z-50 flex flex-col transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-bb-border">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-bb-amber flex items-center justify-center">
              <span className="text-sm font-black text-bb-surface-0">B</span>
            </div>
            <span className="text-base font-bold text-bb-text-1">{t("common.appName")}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bb-surface-2 transition-colors">
            <X className="h-5 w-5 text-bb-text-3" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.isCreate) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-button bg-bb-amber px-4 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:shadow-bb-elevated transition-all"
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
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-button px-4 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "text-bb-amber bg-bb-amber/10 border-l-[3px] border-bb-amber"
                    : "text-bb-text-2 hover:text-bb-text-1 hover:bg-bb-surface-2 border-l-[3px] border-transparent"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="flex-1">{t(item.labelKey)}</span>
                {item.hasBadge && (
                  <span className="h-5 min-w-5 rounded-full bg-bb-amber text-bb-surface-0 text-[10px] font-bold flex items-center justify-center px-1.5">
                    3
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-bb-border">
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
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-button px-4 py-2 text-sm transition-all group border-l-[3px]",
                    isActive
                      ? "text-bb-text-1 bg-bb-surface-2"
                      : "text-bb-text-3 hover:text-bb-text-1 hover:bg-bb-surface-2 border-transparent"
                  )}
                  style={isActive ? { borderLeftColor: section.color } : undefined}
                >
                  {Icon && (
                    <div style={{ color: section.color }}>
                      <Icon className="h-4 w-4" />
                    </div>
                  )}
                  <span>{t(section.nameKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Area */}
        <div className="border-t border-bb-border p-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <GradientAvatar color={user.avatarColor} initial={user.avatarInitial} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-bb-text-1 truncate">{user.name}</p>
              <p className="text-[10px] text-bb-text-3">
                {t("profile.influenceScore")} {user.stats.influenceScore}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

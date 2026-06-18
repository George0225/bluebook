"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";

const tabs = [
  { id: "home", href: "/", icon: Home, labelKey: "nav.home", isCenter: false },
  { id: "discover", href: "/discover", icon: Compass, labelKey: "nav.discover", isCenter: false },
  { id: "create", href: "/create", icon: PlusSquare, labelKey: "nav.create", isCenter: true },
  { id: "messages", href: "/messages", icon: MessageCircle, labelKey: "nav.messages", isCenter: false },
  { id: "profile", href: "/profile", icon: User, labelKey: "nav.profile", isCenter: false },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bb-surface-1/95 backdrop-blur-md border-t border-bb-border">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative -mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bb-amber shadow-bb-button text-bb-surface-0 hover:bg-bb-amber/90 transition-colors"
              >
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-bb-text-3 transition-colors",
                isActive && "text-bb-amber"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { useState } from "react";
import { Search, Bell, Menu, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { LocaleToggle } from "@/components/shared/locale-toggle";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { currentUser } from "@/data/mock-users";

interface TopBarProps {
  showBack?: boolean;
  title?: string;
  onMenuClick?: () => void;
}

export function TopBar({ showBack, title, onMenuClick }: TopBarProps) {
  const { t } = useI18n();
  const router = useRouter();
  const user = currentUser;
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass h-14 border-b border-white/5">
      <div className="flex items-center gap-3 px-4 h-full">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-bb-text-2" />
          </button>
        )}

        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-bb-text-1" />
          </button>
        )}

        {title && (
          <h1 className="text-base font-bold text-bb-text-1">{title}</h1>
        )}

        {/* Search with animated focus glow */}
        <div className={`flex-1 max-w-md mx-auto transition-[max-width] duration-300 ${searchFocused ? "max-w-lg" : ""}`}>
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-[background-color,box-shadow,border-color] duration-300 ${searchFocused ? "bg-bb-surface-2/80 shadow-[0_0_20px_rgba(232,120,42,0.15)] border border-bb-amber/30" : "bg-bb-surface-2/60 border border-transparent"}`}>
            <Search className={`h-4 w-4 flex-shrink-0 transition-colors ${searchFocused ? "text-bb-amber" : "text-bb-text-3"}`} />
            <input
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={t("search.placeholder")}
              className="w-full bg-transparent text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
            <Bell className="h-5 w-5 text-bb-text-2" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-bb-amber animate-pulse" style={{ boxShadow: "0 0 6px rgba(232,120,42,0.8)" }} />
          </button>
          <button className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-200">
            <GradientAvatar
              color={user.avatarColor}
              initial={user.avatarInitial}
              size="sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

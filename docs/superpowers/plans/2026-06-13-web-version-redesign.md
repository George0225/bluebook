# BlueBook Web Version Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild BlueBook from a mobile-only 512px layout to a full desktop web experience with responsive sidebar navigation and industrial grid feed.

**Architecture:** Three layout shells (DesktopShell with persistent sidebar, TabletShell with drawer, MobileShell with bottom tabs) selected by a ResponsiveShell wrapper via `useMediaQuery`. Data layer (types, stores, mock data, i18n) is preserved. All layout, navigation, and page components are rewritten. Feed uses CSS Grid with modulated card heights instead of CSS columns.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui + Zustand + Framer Motion + Lucide React

---

## File Structure

### New Files
| File | Responsibility |
|---|---|
| `src/hooks/use-responsive.ts` | Viewport breakpoint detection hook |
| `src/components/layout/sidebar.tsx` | Desktop sidebar with nav + sections + user info |
| `src/components/layout/sidebar-sheet.tsx` | Tablet/mobile drawer version of sidebar |
| `src/components/layout/desktop-shell.tsx` | Desktop layout: sidebar + topbar + content |
| `src/components/layout/tablet-shell.tsx` | Tablet layout: topbar + drawer + content |
| `src/components/layout/responsive-shell.tsx` | Breakpoint-aware shell switcher |
| `src/components/layout/top-bar.tsx` | Desktop/tablet top bar with inline search |
| `src/components/feed/industrial-grid.tsx` | CSS Grid masonry with modulated heights |
| `src/components/feed/feed-card-large.tsx` | Large card variant (1:1.8 aspect ratio) |

### Rewritten Files
| File | Change |
|---|---|
| `src/components/layout/mobile-shell.tsx` | Remove `max-w-lg` lock, adapt for full-width mobile |
| `src/components/layout/bottom-tab-bar.tsx` | Remove `max-w-lg` inner constraint |
| `src/components/feed/feed-card.tsx` | Support `size` prop (standard/large), adjust for grid |
| `src/components/shared/gradient-cover.tsx` | Add `variant` prop for standard/large card sizes |
| `src/app/layout.tsx` | Wrap children with ResponsiveShell instead of just ClientProviders |
| `src/app/page.tsx` | Desktop-aware home page using new shell components |
| `src/app/discover/page.tsx` | 3-column section cards on desktop |
| `src/app/create/page.tsx` | Wider editor, drag-drop area |
| `src/app/messages/page.tsx` | Desktop message layout |
| `src/app/profile/page.tsx` | Banner + stats row + 5-column grid |
| `src/app/search/page.tsx` | Inline search results on desktop |
| `src/app/post/[id]/page.tsx` | Wider detail layout |
| `src/app/[section]/page.tsx` | Section page with hero banner |

### Unchanged Files
| File | Reason |
|---|---|
| `src/types/*` | Data types don't change |
| `src/data/*` | Mock data doesn't change |
| `src/stores/*` | State management stays the same |
| `src/i18n/*` | i18n provider and messages stay the same |
| `src/lib/*` | Utils, constants, animations stay the same |
| `src/components/ui/*` | shadcn/ui components stay the same |
| `src/components/post/like-button.tsx` | Interaction components stay the same |
| `src/components/post/bookmark-button.tsx` | Interaction components stay the same |
| `src/components/feed/feed-tabs.tsx` | Feed tabs stay the same |
| `src/components/layout/category-tabs.tsx` | Category tabs stay the same |
| `src/components/shared/locale-toggle.tsx` | Locale toggle stays the same |
| `src/components/shared/gradient-avatar.tsx` | Avatar stays the same |
| `src/components/shared/tag-badge.tsx` | Badge stays the same |
| `src/app/auth/login/page.tsx` | Auth pages only need minor width adjustments |
| `src/app/auth/register/page.tsx` | Auth pages only need minor width adjustments |
| `src/app/not-found.tsx` | 404 page stays the same |

---

## Task 1: Responsive Hook

**Files:**
- Create: `src/hooks/use-responsive.ts`

- [ ] **Step 1: Create the useResponsive hook**

```tsx
"use client";

import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useResponsive(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setBreakpoint("desktop");
      else if (w >= 768) setBreakpoint("tablet");
      else setBreakpoint("mobile");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return breakpoint;
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-responsive.ts
git commit -m "feat: add useResponsive hook for breakpoint detection"
```

---

## Task 2: Desktop Sidebar

**Files:**
- Create: `src/components/layout/sidebar.tsx`

- [ ] **Step 1: Create the Sidebar component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Compass, PlusSquare, MessageCircle, User,
  Shield, Search, Gamepad2, Dumbbell, TrendingUp,
  Settings, LogOut, Moon, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { currentUser } from "@/data/mock-users";

const mainNav = [
  { id: "home", href: "/", icon: Home, labelKey: "nav.home" },
  { id: "discover", href: "/discover", icon: Compass, labelKey: "nav.discover" },
  { id: "create", href: "/create", icon: PlusSquare, labelKey: "nav.create", isCreate: true },
  { id: "messages", href: "/messages", icon: MessageCircle, labelKey: "nav.messages", hasBadge: true },
  { id: "profile", href: "/profile", icon: User, labelKey: "nav.profile" },
] as const;

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Search, Gamepad2, Dumbbell, TrendingUp,
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const user = currentUser;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-bb-surface-1 border-r border-bb-border flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-bb-border">
        <div className="h-8 w-8 rounded-lg bg-bb-amber flex items-center justify-center">
          <span className="text-sm font-black text-bb-surface-0">B</span>
        </div>
        <span className="text-base font-bold text-bb-text-1">{t("common.appName")}</span>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isCreate) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 rounded-button bg-bb-amber px-4 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:shadow-bb-elevated hover:-translate-y-px transition-all"
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

        {/* Sections */}
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
                className={cn(
                  "flex items-center gap-3 rounded-button px-4 py-2 text-sm transition-all group border-l-[3px]",
                  isActive
                    ? "text-bb-text-1 bg-bb-surface-2"
                    : "text-bb-text-3 hover:text-bb-text-1 hover:bg-bb-surface-2 border-transparent"
                )}
                style={isActive ? { borderLeftColor: section.color } : undefined}
              >
                {Icon && (
                  <div className="group-hover:opacity-100 transition-opacity" style={{ color: section.color }}>
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
        <button className="flex items-center gap-3 w-full rounded-button px-2 py-2 hover:bg-bb-surface-2 transition-colors">
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
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat: add desktop sidebar navigation component"
```

---

## Task 3: Sidebar Sheet (Drawer)

**Files:**
- Create: `src/components/layout/sidebar-sheet.tsx`

- [ ] **Step 1: Create the SidebarSheet component**

Uses shadcn `Sheet` for the drawer on tablet/mobile.

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Compass, PlusSquare, MessageCircle, User,
  Shield, Search, Gamepad2, Dumbbell, TrendingUp,
  Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { currentUser } from "@/data/mock-users";

const mainNav = [
  { id: "home", href: "/", icon: Home, labelKey: "nav.home" },
  { id: "discover", href: "/discover", icon: Compass, labelKey: "nav.discover" },
  { id: "create", href: "/create", icon: PlusSquare, labelKey: "nav.create", isCreate: true },
  { id: "messages", href: "/messages", icon: MessageCircle, labelKey: "nav.messages", hasBadge: true },
  { id: "profile", href: "/profile", icon: User, labelKey: "nav.profile" },
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

        {/* Navigation - same structure as Sidebar */}
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
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/sidebar-sheet.tsx
git commit -m "feat: add sidebar sheet drawer for tablet/mobile"
```

---

## Task 4: Desktop Top Bar

**Files:**
- Create: `src/components/layout/top-bar.tsx`

- [ ] **Step 1: Create the TopBar component**

Desktop/tablet top bar with inline search input.

```tsx
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
    <header className="sticky top-0 z-30 bg-bb-surface-1/95 backdrop-blur-md border-b border-bb-border h-14">
      <div className="flex items-center gap-3 px-4 h-full">
        {/* Hamburger for tablet/mobile */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bb-surface-2 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-bb-text-2" />
          </button>
        )}

        {/* Back button */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bb-surface-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-bb-text-1" />
          </button>
        )}

        {/* Title */}
        {title && (
          <h1 className="text-base font-bold text-bb-text-1">{title}</h1>
        )}

        {/* Search */}
        <div className={`flex-1 max-w-md mx-auto transition-all ${searchFocused ? "max-w-lg" : ""}`}>
          <div className="flex items-center gap-2 rounded-lg bg-bb-surface-2 px-3 py-2">
            <Search className="h-4 w-4 text-bb-text-3 flex-shrink-0" />
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
          <button className="relative p-2 rounded-lg hover:bg-bb-surface-2 transition-colors">
            <Bell className="h-5 w-5 text-bb-text-2" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-bb-amber" />
          </button>
          <button className="p-1 rounded-lg hover:bg-bb-surface-2 transition-colors">
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
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/top-bar.tsx
git commit -m "feat: add desktop/tablet top bar with inline search"
```

---

## Task 5: Layout Shells (Desktop, Tablet, Mobile, Responsive)

**Files:**
- Rewrite: `src/components/layout/mobile-shell.tsx`
- Create: `src/components/layout/desktop-shell.tsx`
- Create: `src/components/layout/tablet-shell.tsx`
- Create: `src/components/layout/responsive-shell.tsx`

- [ ] **Step 1: Rewrite MobileShell — remove max-w-lg lock**

Replace the entire content of `src/components/layout/mobile-shell.tsx`:

```tsx
"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { BottomTabBar } from "./bottom-tab-bar";
import { SidebarSheet } from "./sidebar-sheet";

interface MobileShellProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export function MobileShell({ children, showBack, title }: MobileShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bb-surface-0">
      <TopBar
        showBack={showBack}
        title={title}
        onMenuClick={() => setDrawerOpen(true)}
      />
      <SidebarSheet open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="pb-20">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
```

- [ ] **Step 2: Create DesktopShell**

```tsx
"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

interface DesktopShellProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export function DesktopShell({ children, showBack, title }: DesktopShellProps) {
  return (
    <div className="min-h-screen bg-bb-surface-0">
      <Sidebar />
      <div className="lg:ml-60">
        <TopBar showBack={showBack} title={title} />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create TabletShell**

```tsx
"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { SidebarSheet } from "./sidebar-sheet";

interface TabletShellProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export function TabletShell({ children, showBack, title }: TabletShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bb-surface-0">
      <TopBar
        showBack={showBack}
        title={title}
        onMenuClick={() => setDrawerOpen(true)}
      />
      <SidebarSheet open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main>
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Create ResponsiveShell**

```tsx
"use client";

import { useResponsive } from "@/hooks/use-responsive";
import { DesktopShell } from "./desktop-shell";
import { TabletShell } from "./tablet-shell";
import { MobileShell } from "./mobile-shell";

interface ResponsiveShellProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export function ResponsiveShell({ children, showBack, title }: ResponsiveShellProps) {
  const breakpoint = useResponsive();

  if (breakpoint === "desktop") {
    return <DesktopShell showBack={showBack} title={title}>{children}</DesktopShell>;
  }

  if (breakpoint === "tablet") {
    return <TabletShell showBack={showBack} title={title}>{children}</TabletShell>;
  }

  return <MobileShell showBack={showBack} title={title}>{children}</MobileShell>;
}
```

- [ ] **Step 5: Update BottomTabBar — remove max-w-lg inner constraint**

In `src/components/layout/bottom-tab-bar.tsx`, change:
```
<div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
```
to:
```
<div className="flex items-center justify-around px-2 py-1">
```

- [ ] **Step 6: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add desktop/tablet/mobile shells with responsive switching"
```

---

## Task 6: Industrial Grid

**Files:**
- Create: `src/components/feed/industrial-grid.tsx`
- Modify: `src/components/shared/gradient-cover.tsx` — add `variant` prop

- [ ] **Step 1: Update GradientCover to support card variants**

In `src/components/shared/gradient-cover.tsx`, add a `variant` prop:

```tsx
interface GradientCoverProps {
  gradient: string;
  aspectRatio: number;
  title?: string;
  className?: string;
  variant?: "standard" | "large";
}

export function GradientCover({ gradient, aspectRatio, title, className, variant = "standard" }: GradientCoverProps) {
  const ratio = variant === "large" ? 1.8 : variant === "standard" ? 1.2 : aspectRatio;
  const paddingBottom = `${(1 / ratio) * 100}%`;

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <div style={{ paddingBottom, background: gradient }} className="w-full">
        {title && (
          <div className="absolute inset-0 flex items-end p-3">
            <span className="text-xs font-bold text-white/90 drop-shadow-lg line-clamp-2">
              {title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update FeedCard to accept size prop**

In `src/components/feed/feed-card.tsx`, add a `size` prop:

```tsx
"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import type { Post } from "@/types/post";
import { SECTIONS } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";
import { GradientCover } from "@/components/shared/gradient-cover";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { LikeButton } from "@/components/post/like-button";
import { TagBadge } from "@/components/shared/tag-badge";

interface FeedCardProps {
  post: Post;
  size?: "standard" | "large";
}

export function FeedCard({ post, size = "standard" }: FeedCardProps) {
  const { t } = useI18n();
  const section = SECTIONS[post.sectionId];

  return (
    <Link
      href={`/post/${post.id}`}
      className="group block"
    >
      <div className="rounded-card bg-bb-surface-1 border border-bb-border overflow-hidden shadow-bb-card group-hover:shadow-bb-elevated group-hover:-translate-y-0.5 transition-all duration-200">
        <GradientCover
          gradient={post.coverGradient}
          aspectRatio={post.coverAspectRatio}
          variant={size}
        />

        <div className="p-3 space-y-2">
          <div className="flex items-start gap-1.5">
            {post.isHot && (
              <Flame className="h-3.5 w-3.5 text-bb-amber flex-shrink-0 mt-0.5" />
            )}
            <h3 className={`font-semibold text-bb-text-1 line-clamp-2 leading-tight ${size === "large" ? "text-base" : "text-sm"}`}>
              {post.title}
            </h3>
          </div>

          {size === "large" && (
            <p className="text-xs text-bb-text-2 line-clamp-2">{post.summary}</p>
          )}

          <TagBadge
            label={t(section.nameKey)}
            color={section.color}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <GradientAvatar
                color={post.author.avatarColor}
                initial={post.author.avatarInitial}
                size="sm"
              />
              <span className="text-xs text-bb-text-3 truncate max-w-[80px]">
                {post.author.name}
              </span>
            </div>

            <LikeButton postId={post.id} initialCount={post.stats.likes} />
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Create IndustrialGrid component**

CSS Grid masonry with modulated card heights — standard (1:1.2) and large (1:1.8) alternating.

```tsx
"use client";

import type { Post } from "@/types/post";
import { FeedCard } from "./feed-card";

interface IndustrialGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

export function IndustrialGrid({ posts, columns = 3 }: IndustrialGridProps) {
  // Pattern: [standard, standard, large] repeating, shifted each row
  // In a 3-column grid: large cards span 2 rows
  const getCardSize = (index: number): "standard" | "large" => {
    const patternPos = index % 9; // Repeating pattern of 9
    // Pattern: s, s, L, s, L, s, s, s, L
    const largePositions = [2, 4, 8];
    return largePositions.includes(patternPos) ? "large" : "standard";
  };

  const getRowSpan = (index: number): string => {
    return getCardSize(index) === "large" ? "row-span-2" : "";
  };

  return (
    <div
      className="grid gap-3 px-4 py-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(120px, auto)",
      }}
    >
      {posts.map((post, index) => (
        <div key={post.id} className={getRowSpan(index)}>
          <FeedCard post={post} size={getCardSize(index)} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/feed/industrial-grid.tsx src/components/feed/feed-card.tsx src/components/shared/gradient-cover.tsx
git commit -m "feat: add industrial grid with modulated card heights"
```

---

## Task 7: Rewrite Home Page

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Rewrite home page using ResponsiveShell and IndustrialGrid**

```tsx
"use client";

import { useMemo } from "react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { FeedTabs } from "@/components/feed/feed-tabs";
import { IndustrialGrid } from "@/components/feed/industrial-grid";
import { useFeedStore } from "@/stores/feed-store";
import { useResponsive } from "@/hooks/use-responsive";
import { mockPosts } from "@/data/mock-posts";
import type { SectionId } from "@/types/post";

export default function HomePage() {
  const { activeTab, activeSection, setTab, setSection } = useFeedStore();
  const breakpoint = useResponsive();

  const filteredPosts = useMemo(() => {
    let posts = mockPosts;
    if (activeSection !== "all") {
      posts = posts.filter((p) => p.sectionId === activeSection);
    }
    if (activeTab === "following") {
      posts = posts.filter((p) => ["u1", "u2", "u4", "u5"].includes(p.author.id));
    }
    return posts;
  }, [activeTab, activeSection]);

  const gridColumns = breakpoint === "mobile" ? 2 : 3;

  return (
    <ResponsiveShell>
      <div className="max-w-2xl mx-auto">
        <FeedTabs activeTab={activeTab} onTabChange={setTab} />
        <CategoryTabs
          activeSection={activeSection as SectionId | "all"}
          onSectionChange={setSection}
        />
        {filteredPosts.length > 0 ? (
          <IndustrialGrid posts={filteredPosts} columns={gridColumns} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-bb-text-3">
            <p className="text-sm">暂无内容</p>
          </div>
        )}
      </div>
    </ResponsiveShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite home page with responsive shell and industrial grid"
```

---

## Task 8: Rewrite Discover Page

**Files:**
- Rewrite: `src/app/discover/page.tsx`

- [ ] **Step 1: Rewrite discover page with 3-column section cards**

```tsx
"use client";

import Link from "next/link";
import { Flame, Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { useI18n } from "@/i18n/provider";
import { SECTIONS } from "@/lib/constants";
import { getHotPosts } from "@/data/mock-posts";

const sectionIcons = { Shield, Search, Gamepad2, Dumbbell, TrendingUp } as const;

export default function DiscoverPage() {
  const { t } = useI18n();
  const hotPosts = getHotPosts();

  return (
    <ResponsiveShell title={t("nav.discover")}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-base font-bold text-bb-text-1 mb-3">{t("nav.discover")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(SECTIONS).map((section) => {
            const Icon = sectionIcons[section.icon as keyof typeof sectionIcons];
            return (
              <Link
                key={section.id}
                href={section.route}
                className="group relative overflow-hidden rounded-card border border-bb-border bg-bb-surface-1 p-4 shadow-bb-card hover:shadow-bb-elevated hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: section.color }}
                />
                <div className="relative space-y-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${section.color}25` }}
                  >
                    <div style={{ color: section.color }}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-bb-text-1">{t(section.nameKey)}</h3>
                    <p className="text-xs text-bb-text-3 mt-1">{t(section.descKey)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-base font-bold text-bb-text-1 mb-4">{t("feed.hotPosts")}</h2>
          <div className="space-y-2">
            {hotPosts.slice(0, 10).map((post, idx) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="flex items-center gap-3 rounded-card bg-bb-surface-1 border border-bb-border p-3 hover:bg-bb-surface-2 transition-colors"
              >
                <span className="text-lg font-black text-bb-amber w-6 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-bb-text-1 font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <GradientAvatar
                      color={post.author.avatarColor}
                      initial={post.author.avatarInitial}
                      size="sm"
                      className="!h-4 !w-4 !text-[8px]"
                    />
                    <span className="text-[10px] text-bb-text-3">{post.author.name}</span>
                    <Flame className="h-3 w-3 text-bb-amber" />
                    <span className="text-[10px] text-bb-text-3">{post.stats.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/discover/page.tsx
git commit -m "feat: rewrite discover page with 3-column section cards"
```

---

## Task 9: Rewrite Post Detail Page

**Files:**
- Rewrite: `src/app/post/[id]/page.tsx`

- [ ] **Step 1: Rewrite post detail page with wider layout**

```tsx
"use client";

import { useParams } from "next/navigation";
import { Share2, MoreHorizontal, MessageCircle } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { GradientCover } from "@/components/shared/gradient-cover";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { LikeButton } from "@/components/post/like-button";
import { BookmarkButton } from "@/components/post/bookmark-button";
import { TagBadge } from "@/components/shared/tag-badge";
import { useI18n } from "@/i18n/provider";
import { getPostById } from "@/data/mock-posts";
import { getCommentsByPostId } from "@/data/mock-comments";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function PostDetailPage() {
  const params = useParams();
  const { t } = useI18n();
  const [commentTab, setCommentTab] = useState<"analysis" | "hot">("hot");

  const postId = params.id as string;
  const post = getPostById(postId);

  if (!post) {
    return (
      <ResponsiveShell showBack>
        <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
          帖子不存在
        </div>
      </ResponsiveShell>
    );
  }

  const section = SECTIONS[post.sectionId];
  const comments = getCommentsByPostId(postId);
  const filteredComments =
    commentTab === "analysis"
      ? comments.filter((c) => c.isAnalysis)
      : [...comments].sort((a, b) => b.likes - a.likes);

  return (
    <ResponsiveShell showBack>
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        <GradientCover gradient={post.coverGradient} aspectRatio={post.coverAspectRatio * 0.7} className="rounded-card" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TagBadge label={t(section.nameKey)} color={section.color} />
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} label={`#${tag}`} />
            ))}
          </div>

          <h1 className="text-xl font-bold text-bb-text-1 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-3">
            <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="md" />
            <div>
              <p className="text-sm font-medium text-bb-text-1">{post.author.name}</p>
              <p className="text-[10px] text-bb-text-3">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-bb-text-2 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {post.poll && (
          <div className="rounded-card bg-bb-surface-1 border border-bb-border p-4 space-y-3">
            <h3 className="text-sm font-bold text-bb-text-1">{post.poll.question}</h3>
            {post.poll.options.map((opt) => {
              const totalVotes = post.poll!.options.reduce((sum, o) => sum + o.votes, 0);
              const percentage = Math.round((opt.votes / totalVotes) * 100);
              return (
                <button key={opt.id} className="relative w-full rounded-button bg-bb-surface-2 p-3 text-left overflow-hidden hover:bg-bb-surface-3 transition-colors">
                  <div className="absolute inset-0 bg-bb-amber/15" style={{ width: `${percentage}%` }} />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm text-bb-text-1">{opt.text}</span>
                    <span className="text-xs text-bb-text-3">{percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-around py-3 border-y border-bb-border">
          <LikeButton postId={post.id} initialCount={post.stats.likes} size="md" />
          <BookmarkButton postId={post.id} initialCount={post.stats.bookmarks} />
          <div className="flex items-center gap-1">
            <MessageCircle className="h-5 w-5 text-bb-text-3" />
            <span className="text-xs text-bb-text-3">{post.stats.comments}</span>
          </div>
          <button className="flex items-center gap-1">
            <Share2 className="h-5 w-5 text-bb-text-3" />
            <span className="text-xs text-bb-text-3">{t("post.shares")}</span>
          </button>
        </div>

        <div>
          <div className="flex gap-6 py-2 border-b border-bb-border">
            <button onClick={() => setCommentTab("hot")} className={cn("relative text-sm py-2 transition-colors", commentTab === "hot" ? "text-bb-text-1 font-medium" : "text-bb-text-3")}>
              {t("post.hotComments")}
              {commentTab === "hot" && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full metallic-gradient" />}
            </button>
            <button onClick={() => setCommentTab("analysis")} className={cn("relative text-sm py-2 transition-colors", commentTab === "analysis" ? "text-bb-text-1 font-medium" : "text-bb-text-3")}>
              {t("post.rationalAnalysis")}
              {commentTab === "analysis" && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full metallic-gradient" />}
            </button>
          </div>

          <div className="divide-y divide-bb-border">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="py-3 space-y-2">
                <div className="flex items-start gap-3">
                  <GradientAvatar color={comment.author.avatarColor} initial={comment.author.avatarInitial} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-bb-text-1">{comment.author.name}</span>
                      {comment.isAnalysis && <span className="rounded-badge bg-bb-section-awareness/20 px-1.5 py-0.5 text-[9px] text-bb-section-awareness font-medium">理性</span>}
                    </div>
                    <p className="text-sm text-bb-text-2 mt-1">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-[10px] text-bb-text-3 hover:text-bb-amber transition-colors">{comment.likes} 赞</button>
                      <button className="text-[10px] text-bb-text-3 hover:text-bb-amber transition-colors">{t("post.reply")}</button>
                      <span className="text-[10px] text-bb-text-3">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {comment.replies.length > 0 && (
                  <div className="ml-9 space-y-2 mt-2 pl-3 border-l border-bb-border">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <GradientAvatar color={reply.author.avatarColor} initial={reply.author.avatarInitial} size="sm" />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-bb-text-1">{reply.author.name}</span>
                          <p className="text-xs text-bb-text-2 mt-0.5">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input placeholder={t("post.writeComment")} className="flex-1 rounded-lg bg-bb-surface-2 px-3 py-2.5 text-sm text-bb-text-1 placeholder:text-bb-text-3 outline-none focus:ring-1 focus:ring-bb-amber" />
          <button className="rounded-button bg-bb-amber px-4 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button">发送</button>
        </div>
      </div>
    </ResponsiveShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/post/[id]/page.tsx
git commit -m "feat: rewrite post detail page with wider desktop layout"
```

---

## Task 10: Rewrite Remaining Pages

**Files:**
- Rewrite: `src/app/profile/page.tsx`
- Rewrite: `src/app/messages/page.tsx`
- Rewrite: `src/app/create/page.tsx`
- Rewrite: `src/app/search/page.tsx`
- Rewrite: `src/app/[section]/page.tsx`

Each page follows the same pattern: replace `MobileShell`/`TopAppBar`/`BottomTabBar` with `ResponsiveShell`, wrap content in `max-w-2xl mx-auto`, and adjust layouts for wider viewports.

Key changes per page:
- **Profile**: Add gradient banner, 4-stat row, 5-column grid on desktop
- **Messages**: Two-column layout on desktop (conversation list + detail)
- **Create**: Full-width editor area, drag-drop zone
- **Search**: Inline results, wider filter bar
- **Section**: Hero banner with section color, IndustrialGrid for posts

Since the pattern is identical for each page (replace old shells with ResponsiveShell, add max-w-2xl), and each is ~100-200 lines, implement them all in one task.

- [ ] **Step 1: Rewrite profile page**

Replace `src/app/profile/page.tsx` with the same content as current but:
- Replace `<MobileShell>` + `<TopAppBar>` + `<BottomTabBar>` with `<ResponsiveShell title={...}>`
- Wrap content in `<div className="max-w-2xl mx-auto">`
- Change posts grid from `columns-2` to `grid grid-cols-3 md:grid-cols-5 gap-2`
- Add gradient banner header: `<div className="h-32 bg-gradient-to-r from-bb-amber/20 to-bb-gold/20" />`

- [ ] **Step 2: Rewrite messages page**

Same shell replacement pattern. Add two-column layout on desktop:
- `<div className="grid grid-cols-1 md:grid-cols-3 gap-0">` with conversation list (1 col) and detail (2 cols)

- [ ] **Step 3: Rewrite create page**

Same shell replacement with `showBack`. Wider editor, drag-drop area.

- [ ] **Step 4: Rewrite search page**

Same shell replacement. Wider search bar, inline results.

- [ ] **Step 5: Rewrite section page**

Same shell replacement with `showBack title={...}`. Add hero banner with section color gradient.

- [ ] **Step 6: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/app/profile/page.tsx src/app/messages/page.tsx src/app/create/page.tsx src/app/search/page.tsx "src/app/[section]/page.tsx"
git commit -m "feat: rewrite all pages with responsive shell and desktop layouts"
```

---

## Task 11: Clean Up Old Components

**Files:**
- Delete: `src/components/layout/top-app-bar.tsx` (replaced by top-bar.tsx)
- Delete: `src/components/feed/waterfall-grid.tsx` (replaced by industrial-grid.tsx)

- [ ] **Step 1: Verify no imports reference old components**

Run: `grep -r "top-app-bar\|TopAppBar\|waterfall-grid\|WaterfallGrid" src/ --include="*.tsx" --include="*.ts"`
Expected: No matches (all pages now use TopBar and IndustrialGrid)

- [ ] **Step 2: Delete old components**

```bash
rm src/components/layout/top-app-bar.tsx src/components/feed/waterfall-grid.tsx
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old mobile-only layout components"
```

---

## Task 12: Final Verification

- [ ] **Step 1: Run production build**

Run: `npx next build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 2: Start dev server and visually verify**

Run: `npx next dev --port 3000`

Verify at each breakpoint:
- **Desktop (≥1024px)**: Sidebar visible, content centered at 672px, 3-column grid
- **Tablet (768-1023px)**: No sidebar, hamburger menu opens drawer, content at 576px
- **Mobile (<768px)**: Bottom tab bar, hamburger for sections, full-width 2-column grid

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive layout adjustments from visual verification"
```

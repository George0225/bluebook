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

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

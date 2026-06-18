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

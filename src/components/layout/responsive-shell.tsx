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

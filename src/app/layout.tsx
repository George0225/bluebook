import type { Metadata } from "next";
import { ClientProviders } from "@/components/client-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "小蓝书 BlueBook - 标记你的硬核生活",
  description: "以男性用户为核心的优质内容社区与生活方式平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-bb-surface-0 text-bb-text-1 font-['Inter',sans-serif]">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

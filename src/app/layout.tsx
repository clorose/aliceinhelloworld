// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "Alice in Helloworld",
  description: "OS Style Multi-blog & Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col h-screen">
        {/* TopBar - OS 스타일의 상단 메뉴바 */}
        <TopBar />

        {children}
      </body>
    </html>
  );
}

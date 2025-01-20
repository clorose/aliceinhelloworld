// path: ~/Develop/aliceinhelloworld/src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/reset.css";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}

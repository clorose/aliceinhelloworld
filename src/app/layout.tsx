// path: ~/Develop/aliceinhelloworld/src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/reset.css";
import "./globals.css";
import { BlogHeader } from "@/components/layout/Header";

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
      <body>
        <BlogHeader
          frontmatter={{ title: "Sample Title", date: "2023-10-01" }}
        />
        {children}
      </body>
    </html>
  );
}

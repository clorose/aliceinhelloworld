// path: ~/02_Dev/aliceinhelloworld/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// Pretendard Variable Font
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

// Hack 폰트
const hack = localFont({
  src: [
    {
      path: "../public/fonts/hack-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/hack-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/hack-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/hack-bolditalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-hack",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alice in HelloWorld",
  description:
    "Personal blog exploring AI Research, TRPG Scenarios, and Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${hack.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

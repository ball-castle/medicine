import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "中医动态学习地图",
  description: "把《圆运动》和《火神门》转化成可视化、可交互、可游戏化的学习产品。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

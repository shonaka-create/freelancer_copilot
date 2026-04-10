import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AssetFreelance | MVP Free",
  description: "フリーランス向け営業・案件管理（無料版ベース）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar Nav */}
          <Sidebar />
          
          {/* Main Content */}
          <main style={{ flex: 1, padding: '32px 40px', overflowX: 'auto' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

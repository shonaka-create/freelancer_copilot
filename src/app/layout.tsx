import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssetFreelance | 営業・案件統合管理ツール",
  description: "フリーランス向け多媒体応募・案件獲得・アップセル管理SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <main className="container animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}

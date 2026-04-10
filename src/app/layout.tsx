import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
          <nav style={{ width: '240px', background: '#FFFFFF', borderRight: '1px solid var(--surface-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-color)' }}>AssetFreelance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/" style={{ padding: '8px 12px', borderRadius: '6px', color: 'var(--text-primary)', textDecoration: 'none', background: '#F8FAFC', fontWeight: 500 }}>
                案件カンバン
              </Link>
              <Link href="/templates" style={{ padding: '8px 12px', borderRadius: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500}}>
                定型文の管理
              </Link>
              <Link href="/projects" style={{ padding: '8px 12px', borderRadius: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
                カレンダー・予定
              </Link>
            </div>
          </nav>
          
          {/* Main Content */}
          <main style={{ flex: 1, padding: '32px 40px', overflowX: 'auto' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

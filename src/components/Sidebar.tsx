'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: '案件カンバン', href: '/' },
    { name: '毎日の記録・PDCA', href: '/daily' },
    { name: '定型文の管理', href: '/templates' },
    { name: 'カレンダー・予定', href: '/projects' },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <nav style={{ width: '240px', background: '#FFFFFF', borderRight: '1px solid var(--surface-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-color)' }}>AssetFreelance</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              style={{ 
                padding: '10px 12px', 
                borderRadius: '6px', 
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)', 
                textDecoration: 'none', 
                background: isActive ? '#F0F9FF' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
        <Link 
          href="/pricing"
          style={{ 
            padding: '10px 12px', 
            borderRadius: '6px', 
            color: '#FFFFFF', 
            textDecoration: 'none', 
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
          }}
        >
          👑 PRO にアップグレード
        </Link>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          ログアウト
        </button>
      </div>
    </nav>
  );
}

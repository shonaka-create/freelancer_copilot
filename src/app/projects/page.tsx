import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>← ダッシュボードへ</Link>
            <h1>案件遂行・アップセル管理</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>進行中のプロジェクトとマイルストーン、次回アップセルのアラート</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Project Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '4px' }}>Active</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>A社（直契約）</span>
              </div>
              <h2 style={{ margin: 0 }}>コーポレートサイトフルリニューアル要件定義・設計</h2>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                受注額: ¥800,000 / 納期: 2026/05/20
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>マイルストーン</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#F8FAFC', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: '8px' }}>
              <input type="checkbox" checked readOnly style={{ width: '1.2rem', height: '1.2rem' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>キックオフ＆ヒアリング完了</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>2026/04/01</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFFFFF', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: '8px' }}>
              <input type="checkbox" readOnly style={{ width: '1.2rem', height: '1.2rem' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>ワイヤーフレーム初回提出</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>2026/04/15</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#B91C1C' }}>【アップセル通知】保守運用プランの打診</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>納品の1ヶ月前（4月20日頃）に保守・継続開発の提案を行うと成約率が高まります。</div>
              </div>
              <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>AI提案文作成</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

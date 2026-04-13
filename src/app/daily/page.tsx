'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, AlertCircle, TrendingUp, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlanStatus } from '@/lib/usePlanStatus';

type DailyRecord = { id: string; date: string; action: string; check: string; actionNext: string; };

const STORAGE_KEY = 'af_daily_records';

const SEED: DailyRecord[] = [
  {
    id: 'seed-1',
    date: '2026-04-09',
    action: 'A社と商談、B社に提案文を3件送付',
    check: 'B社向けの提案文で、実績URLをもっと上に配置した方が反応が良さそうだと感じた。',
    actionNext: '明日はポートフォリオURLのテンプレートを修正し、最低5件アプローチする。',
  },
];

function loadRecords(): DailyRecord[] {
  if (typeof window === 'undefined') return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as DailyRecord[];
    return parsed.length ? parsed : SEED;
  } catch { return SEED; }
}

function saveRecords(records: DailyRecord[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch { /* quota */ }
}

export default function DailyPDCAPage() {
  const router = useRouter();
  const { state, isPro, startTrial } = usePlanStatus();
  const [records,  setRecords]  = useState<DailyRecord[]>([]);
  const [formData, setFormData] = useState({ action: '', check: '', actionNext: '' });
  const [query,    setQuery]    = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setHydrated(true);
  }, []);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.action.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const next: DailyRecord[] = [{ id: String(Date.now()), date: today, ...formData }, ...records];
    setRecords(next);
    saveRecords(next);
    setFormData({ action: '', check: '', actionNext: '' });
    alert('今日の積み上げを記録しました！');
  };

  const filtered = records.filter(r =>
    !query || [r.action, r.check, r.actionNext].some(t => t.includes(query))
  );

  // AI レポートカードのCTA
  const AiReportCard = () => {
    if (isPro) {
      return (
        <div className="glass-panel" style={{ background: 'linear-gradient(to bottom right, #F0FDF4, #F8FAFC)', border: '1px solid #6EE7B7', textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ color: '#059669', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1rem' }}>
            ✅ 自己分析AIレポート
            <span style={{ fontSize: '0.7rem', background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>
              {state.plan === 'trial' ? '試用中' : 'PRO'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 auto 1rem', maxWidth: '400px' }}>
            毎週末にPDCAデータをAIが分析し、営業の課題と最適なアプローチ方法をレポートとして自動生成します。
          </p>
          <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            最新レポートを見る（モック）
          </button>
        </div>
      );
    }

    if (state.plan === 'trial_expired') {
      return (
        <div className="glass-panel" style={{ background: '#FFF7ED', border: '1px dashed #FED7AA', textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ color: '#92400E', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            自己分析AIレポート <span style={{ fontSize: '0.7rem', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>期限切れ</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 auto 1rem', maxWidth: '400px' }}>
            トライアル期間が終了しました。PROプランに移行するとAI分析レポートが再度ご利用いただけます。
          </p>
          <button className="btn-primary" onClick={() => router.push('/pricing')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
            👑 PRO にアップグレード
          </button>
        </div>
      );
    }

    // free
    return (
      <div className="glass-panel" style={{ background: '#F8FAFC', border: '1px dashed var(--surface-border)', textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          自己分析AIレポート <span style={{ fontSize: '0.7rem', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>PRO</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 auto 1rem', maxWidth: '400px' }}>
          Proプランでは、記録されたPDCAデータをAIが毎週末に分析し、あなたの営業における課題と最適なアプローチ方法をレポートとして自動生成します。
        </p>
        <button
          onClick={() => startTrial()}
          style={{
            padding: '10px 20px', border: 'none', cursor: 'pointer', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
          }}
        >
          👑 PRO を7日間試してみる
        </button>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header>
        <h1>毎日の積み上げ・PDCA記録</h1>
        <p style={{ color: 'var(--text-secondary)' }}>日々の行動量と気づきをストックし、営業の質を高めましょう。</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>

        {/* ── Input Form ── */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'flex-start' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary-color)" /> 新しい記録
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>本日の行動 (Do)</label>
              <textarea
                value={formData.action}
                onChange={e => setFormData({ ...formData, action: e.target.value })}
                required
                placeholder="例: 新規案件に3件応募、A社の事前テスト完了など"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>気づき / 反省 (Check)</label>
              <textarea
                value={formData.check}
                onChange={e => setFormData({ ...formData, check: e.target.value })}
                placeholder="例: 返信が遅いクライアントだった。次回から見極めを早くする。"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>次回の改善 (Action)</label>
              <textarea
                value={formData.actionNext}
                onChange={e => setFormData({ ...formData, actionNext: e.target.value })}
                placeholder="例: 応募文テンプレートの冒頭を実績ベースにテンプレ修正する。"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>記録を保存する</button>
          </form>
        </div>

        {/* ── History List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>
              過去の記録
              {hydrated && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '8px' }}>({records.length}件)</span>
              )}
            </h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-disabled)' }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="キーワード検索..."
                style={{ padding: '8px 10px 8px 32px', borderRadius: '20px', border: '1px solid var(--surface-border)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!hydrated ? (
              <div style={{ color: 'var(--text-disabled)', fontSize: '0.85rem', padding: '1rem 0' }}>読み込み中...</div>
            ) : filtered.length === 0 ? (
              <div style={{ color: 'var(--text-disabled)', fontSize: '0.85rem', padding: '1rem 0' }}>
                {query ? '一致する記録が見つかりません' : '記録がまだありません'}
              </div>
            ) : (
              filtered.map(r => (
                <div key={r.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--primary-color)', color: 'white', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '99px', fontWeight: 'bold' }}>
                    {r.date}
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '4px' }}>行動 (Do)</div>
                    <div style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{r.action}</div>
                  </div>
                  {(r.check || r.actionNext) && <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '4px 0' }} />}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {r.check && (
                      <div style={{ background: '#FFF7ED', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#9A3412', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertCircle size={14} /> 気づき (Check)
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#7C2D12', whiteSpace: 'pre-wrap' }}>{r.check}</div>
                      </div>
                    )}
                    {r.actionNext && (
                      <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckSquare size={14} /> 次の行動 (Action)
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#14532D', whiteSpace: 'pre-wrap' }}>{r.actionNext}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <AiReportCard />
        </div>
      </div>
    </div>
  );
}

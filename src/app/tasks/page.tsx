'use client';

import { useState, useEffect } from 'react';
import { Circle, CheckCircle2, Clock, Play, Pause, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlanStatus } from '@/lib/usePlanStatus';

const TYPE_COLOR: Record<string, string> = {
  deadline: '#EF4444',
  followup: '#3B82F6',
  upsell:   '#F59E0B',
};
const TYPE_LABEL: Record<string, string> = {
  deadline: '納期',
  followup: 'フォロー',
  upsell:   '提案',
};

const initialTasks = [
  { id: '1', date: '2026-04-12', title: '【A社】LPコーディング初回納品',  type: 'deadline', status: 'pending',   projectName: 'A社 LPリニューアル',  rateYen: 1000 },
  { id: '2', date: '2026-04-15', title: '【B社】見積もり再提示・状況確認', type: 'followup', status: 'pending',   projectName: 'B社 新規システム開発', rateYen: 5000 },
  { id: '3', date: '2026-04-20', title: '【C社】保守契約のアップセル提案', type: 'upsell',   status: 'pending',   projectName: 'C社 サイト保守',      rateYen: 3000 },
  { id: '4', date: '2026-04-05', title: '【D社】要件定義書 提出',          type: 'deadline', status: 'completed', projectName: 'D社 メディア構築',    rateYen: 2000 },
];

const proStats = [
  { label: 'A社 LPリニューアル',  rateYen: 1000, hours: 42, recommend: 'down' },
  { label: 'B社 新規システム開発', rateYen: 5000, hours: 18, recommend: 'up'   },
  { label: 'C社 サイト保守',      rateYen: 3000, hours: 25, recommend: 'keep' },
];
const totalHours = proStats.reduce((s, r) => s + r.hours, 0);

type TimerState = { elapsed: number; running: boolean; startedAt: number | null };
type TimerMap   = { [id: string]: TimerState };

function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TasksPage() {
  const router = useRouter();
  const { state, isPro, startTrial } = usePlanStatus();
  const [tasks,  setTasks]  = useState(initialTasks);
  const [timers, setTimers] = useState<TimerMap>({});
  const [tick,   setTick]   = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const getElapsed = (id: string) => {
    const t = timers[id];
    if (!t) return 0;
    if (t.running && t.startedAt !== null) return t.elapsed + Math.floor((Date.now() - t.startedAt) / 1000);
    return t.elapsed;
  };

  const toggleTimer = (id: string) => {
    const now = Date.now();
    setTimers(prev => {
      const t = prev[id] ?? { elapsed: 0, running: false, startedAt: null };
      if (t.running && t.startedAt !== null) {
        return { ...prev, [id]: { elapsed: t.elapsed + Math.floor((now - t.startedAt) / 1000), running: false, startedAt: null } };
      }
      return { ...prev, [id]: { ...t, running: true, startedAt: now } };
    });
  };

  const toggle = (id: string, current: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: current === 'pending' ? 'completed' : 'pending' } : t));
  };

  const pending   = tasks.filter(t => t.status === 'pending').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completed = tasks.filter(t => t.status === 'completed');
  const anyRunning = Object.values(timers).some(t => t.running);
  void tick;

  // アナリティクスパネルのCTA
  const AnalyticsCTA = () => {
    if (state.plan === 'trial_expired') {
      return (
        <button className="btn-primary" onClick={() => router.push('/pricing')} style={{ padding: '10px 24px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
          👑 PRO にアップグレード
        </button>
      );
    }
    return (
      <button className="btn-primary" onClick={() => startTrial()} style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
        👑 PRO を7日間試してみる
      </button>
    );
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>タスク管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>案件に紐づく納期・フォロー・提案タスクの進捗と作業時間を管理</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {anyRunning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              計測中
            </div>
          )}
          <button className="btn-primary">+ タスクを追加</button>
        </div>
      </header>

      {/* ── Pending ── */}
      <div>
        <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Clock size={18} color="var(--primary-color)" /> 未完了
          <span style={{ fontSize: '0.8rem', background: '#EFF6FF', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>{pending.length}</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pending.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-disabled)', padding: '1rem 0' }}>未完了のタスクはありません</p>}
          {pending.map(t => {
            const elapsed = getElapsed(t.id);
            const isRunning = timers[t.id]?.running ?? false;
            return (
              <div key={t.id} className="glass-panel" style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px',
                borderLeft: `4px solid ${TYPE_COLOR[t.type]}`,
                background: isRunning ? '#F0FDF4' : undefined,
                transition: 'background 0.2s',
              }}>
                <div style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggle(t.id, t.status)}>
                  <Circle size={22} color="var(--surface-border)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: 600 }}>
                    {t.date} · {t.projectName}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {elapsed > 0 && (
                    <span style={{ fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums', color: isRunning ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, minWidth: '48px', textAlign: 'right' }}>
                      {fmtTime(elapsed)}
                    </span>
                  )}
                  <button
                    onClick={() => toggleTimer(t.id)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: isRunning ? '#10B981' : '#E2E8F0',
                      color: isRunning ? '#fff' : 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                  >
                    {isRunning ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: '1px' }} />}
                  </button>
                </div>
                <span style={{ fontSize: '0.73rem', background: TYPE_COLOR[t.type] + '18', color: TYPE_COLOR[t.type], padding: '3px 10px', borderRadius: '6px', fontWeight: 600, flexShrink: 0 }}>
                  {TYPE_LABEL[t.type]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Completed ── */}
      <div>
        <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          完了済み <span style={{ fontSize: '0.8rem' }}>({completed.length})</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6 }}>
          {completed.map(t => (
            <div key={t.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', background: '#F8FAFC' }}>
              <div style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggle(t.id, t.status)}>
                <CheckCircle2 size={22} color="#10B981" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '2px', textDecoration: 'line-through' }}>
                  {t.date} · {t.projectName}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{t.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Time Analytics (PRO) ── */}
      <div>
        <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          時間単価・工数ウェイト分析
          <span style={{ fontSize: '0.72rem', background: isPro ? '#D1FAE5' : '#DBEAFE', color: isPro ? '#065F46' : 'var(--primary-dark)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            {state.plan === 'trial' ? '試用中' : 'PRO'}
          </span>
        </h2>

        {isPro ? (
          /* ── PRO/trial: アンロックされたパネル ── */
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.6 }}>
              💡 <strong>B社の実質時給（¥5,000/h）はA社（¥1,000/h）の5倍です。</strong><br/>
              現状A社に月42h（49%）割いており、B社は18h（21%）のみ。配分を最適化すると月収が最大 <strong>+¥84,000</strong> 増える見込みです。
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {proStats.map(r => (
                <div key={r.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{r.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.hours}h ({Math.round(r.hours / totalHours * 100)}%)</span>
                  </div>
                  <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      width: `${r.hours / totalHours * 100}%`,
                      background: r.recommend === 'up' ? '#10B981' : r.recommend === 'down' ? '#EF4444' : '#3B82F6',
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  {['案件', '月工数', '実質時給', 'ウェイト推奨'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {proStats.map(r => (
                  <tr key={r.label} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <td style={{ padding: '8px' }}>{r.label}</td>
                    <td style={{ padding: '8px' }}>{r.hours}h</td>
                    <td style={{ padding: '8px', fontWeight: 600 }}>¥{r.rateYen.toLocaleString()}/h</td>
                    <td style={{ padding: '8px', fontWeight: 700, color: r.recommend === 'up' ? '#10B981' : r.recommend === 'down' ? '#EF4444' : '#3B82F6' }}>
                      {r.recommend === 'up' ? '↑ 増やす' : r.recommend === 'down' ? '↓ 減らす' : '→ 維持'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── free / trial_expired: ロックされたパネル ── */
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.6 }}>
                  💡 <strong>B社の実質時給（¥5,000/h）はA社（¥1,000/h）の5倍です。</strong><br/>
                  現状A社に月42h（49%）割いており、B社は18h（21%）のみ。配分を最適化すると月収が最大 <strong>+¥84,000</strong> 増える見込みです。
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {proStats.map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{r.label}</span>
                        <span>{r.hours}h</span>
                      </div>
                      <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '99px' }}>
                        <div style={{ height: '100%', borderRadius: '99px', width: `${r.hours / totalHours * 100}%`, background: '#CBD5E1' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(2px)', borderRadius: '12px',
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} color="var(--primary-color)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>PRO機能</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '260px' }}>
                  各案件の作業時間・実質時給・最適な工数配分をAIが分析します。
                </div>
              </div>
              <AnalyticsCTA />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

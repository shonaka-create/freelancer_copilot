'use client';

import { useState, useEffect } from 'react';
import { Circle, CheckCircle2, Clock, Play, Pause, Lock, Users, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlanStatus } from '@/lib/usePlanStatus';

// ── Task data ──────────────────────────────────────────────
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

// ── Free analytics data ────────────────────────────────────
const stats = [
  { label: 'A社 LPリニューアル',  rateYen: 1000, hours: 42, recommend: 'down' },
  { label: 'B社 新規システム開発', rateYen: 5000, hours: 18, recommend: 'up'   },
  { label: 'C社 サイト保守',      rateYen: 3000, hours: 25, recommend: 'keep' },
];
const totalHours = stats.reduce((s, r) => s + r.hours, 0);

// ── Gantt / PRO team data ──────────────────────────────────
const GANTT_DAYS = 30; // April 2026

type GanttStatus = 'completed' | 'in-progress' | 'pending';
const GANTT_STATUS_COLOR: Record<GanttStatus, string> = {
  completed:    '#10B981',
  'in-progress':'#3B82F6',
  pending:      '#CBD5E1',
};
const GANTT_STATUS_LABEL: Record<GanttStatus, string> = {
  completed:    '完了',
  'in-progress':'進行中',
  pending:      '未着手',
};

const ganttProjects = [
  {
    id: 'p1', name: 'A社 LPリニューアル', color: '#3B82F6',
    members: ['田中', '佐藤'],
    tasks: [
      { id: 't1', name: 'デザイン確認・FIX',  start: 0,  duration: 7,  status: 'completed'   as GanttStatus, assignee: '田中' },
      { id: 't2', name: 'コーディング実装',    start: 7,  duration: 11, status: 'in-progress' as GanttStatus, assignee: '佐藤' },
      { id: 't3', name: '納品・修正対応',      start: 18, duration: 7,  status: 'pending'     as GanttStatus, assignee: '田中' },
    ],
  },
  {
    id: 'p2', name: 'B社 新規システム開発', color: '#10B981',
    members: ['鈴木', '田中'],
    tasks: [
      { id: 't4', name: '要件定義・設計',   start: 0,  duration: 10, status: 'completed'   as GanttStatus, assignee: '鈴木' },
      { id: 't5', name: '開発・単体テスト', start: 10, duration: 18, status: 'in-progress' as GanttStatus, assignee: '田中' },
    ],
  },
  {
    id: 'p3', name: 'C社 サイト保守', color: '#F59E0B',
    members: ['佐藤'],
    tasks: [
      { id: 't6', name: '月次レポート作成',   start: 5,  duration: 3,  status: 'completed' as GanttStatus, assignee: '佐藤' },
      { id: 't7', name: 'セキュリティ対応',   start: 15, duration: 10, status: 'pending'   as GanttStatus, assignee: '佐藤' },
    ],
  },
];

// today = Apr 16
const TODAY_OFFSET = 15;

// Week markers (day numbers, 0-indexed)
const WEEK_MARKS = [0, 7, 14, 21, 28];

// ── Timer helpers ──────────────────────────────────────────
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

// ── Avatar ─────────────────────────────────────────────────
function Avatar({ name, size = 22 }: { name: string; size?: number }) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: colors[idx], color: '#fff',
      fontSize: size * 0.45, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {name[0]}
    </div>
  );
}

// ── Gantt chart ────────────────────────────────────────────
function GanttChart() {
  const LABEL_W = 180;

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Date header */}
      <div style={{ display: 'flex', marginBottom: '4px' }}>
        <div style={{ width: LABEL_W, flexShrink: 0 }} />
        <div style={{ flex: 1, position: 'relative', height: '20px', minWidth: '400px' }}>
          {WEEK_MARKS.map(d => (
            <div key={d} style={{
              position: 'absolute',
              left: `${d / GANTT_DAYS * 100}%`,
              fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600,
              transform: 'translateX(-50%)',
            }}>
              {d + 1}日
            </div>
          ))}
          {/* Today marker label */}
          <div style={{
            position: 'absolute',
            left: `${TODAY_OFFSET / GANTT_DAYS * 100}%`,
            fontSize: '0.65rem', color: '#EF4444', fontWeight: 700,
            transform: 'translateX(-50%)',
          }}>
            今日
          </div>
        </div>
      </div>

      {/* Projects */}
      {ganttProjects.map(project => (
        <div key={project.id} style={{ marginBottom: '12px' }}>
          {/* Project header row */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{
              width: LABEL_W, flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8rem', fontWeight: 700, color: project.color,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '2px', background: project.color, flexShrink: 0 }} />
              {project.name}
            </div>
            <div style={{ flex: 1, position: 'relative', height: '4px', background: project.color + '20', borderRadius: '2px', minWidth: '400px' }}>
              {/* Today line */}
              <div style={{
                position: 'absolute', left: `${TODAY_OFFSET / GANTT_DAYS * 100}%`,
                top: '-6px', bottom: '-6px', width: '1.5px', background: '#EF4444', opacity: 0.4,
              }} />
            </div>
            {/* Members */}
            <div style={{ display: 'flex', gap: '2px', paddingLeft: '8px' }}>
              {project.members.map(m => <Avatar key={m} name={m} size={20} />)}
            </div>
          </div>

          {/* Task rows */}
          {project.tasks.map(task => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
              <div style={{
                width: LABEL_W, flexShrink: 0,
                fontSize: '0.75rem', color: 'var(--text-secondary)',
                paddingLeft: '16px',
                display: 'flex', alignItems: 'center', gap: '4px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                <Avatar name={task.assignee} size={16} />
                {task.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: '22px', minWidth: '400px' }}>
                {/* Today line */}
                <div style={{
                  position: 'absolute', left: `${TODAY_OFFSET / GANTT_DAYS * 100}%`,
                  top: 0, bottom: 0, width: '1.5px', background: '#EF4444', opacity: 0.25,
                  zIndex: 0,
                }} />
                {/* Task bar */}
                <div style={{
                  position: 'absolute',
                  left: `${task.start / GANTT_DAYS * 100}%`,
                  width: `${task.duration / GANTT_DAYS * 100}%`,
                  top: '2px', bottom: '2px',
                  background: GANTT_STATUS_COLOR[task.status],
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', paddingLeft: '6px',
                  fontSize: '0.62rem', color: task.status === 'pending' ? '#64748B' : '#fff',
                  fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap',
                  zIndex: 1,
                  opacity: task.status === 'pending' ? 0.6 : 1,
                }}>
                  {task.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', paddingLeft: LABEL_W, paddingTop: '8px', borderTop: '1px solid var(--surface-border)', marginTop: '8px' }}>
        {(Object.entries(GANTT_STATUS_LABEL) as [GanttStatus, string][]).map(([status, label]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: GANTT_STATUS_COLOR[status] }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function TasksPage() {
  const router  = useRouter();
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

  const pending    = tasks.filter(t => t.status === 'pending').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completed  = tasks.filter(t => t.status === 'completed');
  const anyRunning = Object.values(timers).some(t => t.running);
  void tick;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>

      {/* ── Header ── */}
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
            const elapsed   = getElapsed(t.id);
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

      {/* ── Time analytics (FREE) ── */}
      <div>
        <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          時間単価・工数ウェイト分析
        </h2>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.6 }}>
            💡 <strong>B社の実質時給（¥5,000/h）はA社（¥1,000/h）の5倍です。</strong><br/>
            現状A社に月42h（49%）割いており、B社は18h（21%）のみ。配分を最適化すると月収が最大 <strong>+¥84,000</strong> 増える見込みです。
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.map(r => (
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
              {stats.map(r => (
                <tr key={r.label} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '8px' }}>{r.label}</td>
                  <td style={{ padding: '8px' }}>{r.hours}h</td>
                  <td style={{ padding: '8px', fontWeight: 600 }}>¥{r.rateYen.toLocaleString()}/h</td>
                  <td style={{ padding: '8px', fontWeight: 700,
                    color: r.recommend === 'up' ? '#10B981' : r.recommend === 'down' ? '#EF4444' : '#3B82F6'
                  }}>
                    {r.recommend === 'up' ? '↑ 増やす' : r.recommend === 'down' ? '↓ 減らす' : '→ 維持'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Project Team + Gantt (PRO) ── */}
      <div>
        <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Users size={18} color="var(--primary-color)" />
          プロジェクトチーム管理 &amp; ガントチャート
          <span style={{ fontSize: '0.72rem', background: isPro ? '#D1FAE5' : '#DBEAFE', color: isPro ? '#065F46' : 'var(--primary-dark)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            {state.plan === 'trial' ? '試用中' : 'PRO'}
          </span>
        </h2>

        {isPro ? (
          /* ── Unlocked ── */
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Team summary */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {ganttProjects.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '99px', border: `1px solid ${p.color}30` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{p.name}</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {p.members.map(m => <Avatar key={m} name={m} size={18} />)}
                  </div>
                </div>
              ))}
              <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 12px', borderRadius: '99px' }}>
                + チームを追加
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                4月 2026 — ガントチャート
              </div>
              <GanttChart />
            </div>
          </div>
        ) : (
          /* ── Locked ── */
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(2.5px)', pointerEvents: 'none', userSelect: 'none' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ganttProjects.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '99px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{p.name}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {p.members.map(m => <Avatar key={m} name={m} size={18} />)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                  <GanttChart />
                </div>
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(2px)', borderRadius: '12px',
            }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={24} color="var(--primary-color)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Crown size={16} color="var(--primary-color)" /> チームとガントチャートはPRO機能
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.6 }}>
                  プロジェクトチームを作成し、メンバーごとにタスクを割り当て。ガントチャートで全体の進捗を一目で把握できます。
                </div>
              </div>
              {state.plan === 'trial_expired' ? (
                <button className="btn-primary" onClick={() => router.push('/pricing')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
                  👑 PRO にアップグレード
                </button>
              ) : (
                <button className="btn-primary" onClick={() => startTrial()} style={{ padding: '10px 24px' }}>
                  👑 PRO を7日間試してみる
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

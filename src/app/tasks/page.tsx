'use client';

import { useState } from 'react';
import { Circle, CheckCircle2, Clock } from 'lucide-react';

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
  { id: '1', date: '2026-04-12', title: '【A社】LPコーディング初回納品',    type: 'deadline', status: 'pending',   projectName: 'A社 LPリニューアル' },
  { id: '2', date: '2026-04-15', title: '【B社】見積もり再提示・状況確認',   type: 'followup', status: 'pending',   projectName: 'B社 新規システム開発' },
  { id: '3', date: '2026-04-20', title: '【C社】保守契約のアップセル提案',   type: 'upsell',   status: 'pending',   projectName: 'C社 サイト保守' },
  { id: '4', date: '2026-04-05', title: '【D社】要件定義書 提出',            type: 'deadline', status: 'completed', projectName: 'D社 メディア構築' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);

  const pending   = tasks.filter(t => t.status === 'pending').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completed = tasks.filter(t => t.status === 'completed');

  const toggle = (id: string, current: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: current === 'pending' ? 'completed' : 'pending' } : t));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>タスク管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>案件に紐づく納期・フォロー・提案タスクの進捗管理</p>
        </div>
        <button className="btn-primary">+ タスクを追加</button>
      </header>

      {/* Pending */}
      <div>
        <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Clock size={18} color="var(--primary-color)" /> 未完了
          <span style={{ fontSize: '0.8rem', background: '#EFF6FF', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>{pending.length}</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pending.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-disabled)', padding: '1rem 0' }}>未完了のタスクはありません</p>
          )}
          {pending.map(t => (
            <div key={t.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', borderLeft: `4px solid ${TYPE_COLOR[t.type]}` }}>
              <div style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => toggle(t.id, t.status)}>
                <Circle size={22} color="var(--surface-border)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: 600 }}>
                  {t.date} · {t.projectName}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.title}</div>
              </div>
              <span style={{ fontSize: '0.73rem', background: TYPE_COLOR[t.type] + '18', color: TYPE_COLOR[t.type], padding: '3px 10px', borderRadius: '6px', fontWeight: 600, flexShrink: 0 }}>
                {TYPE_LABEL[t.type]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
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
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Bell, Circle, CheckCircle2, Clock } from 'lucide-react';

const mockMilestones = [
  { id: '1', date: '2026-04-12', title: '【A社】LPコーディング初回納品', type: 'deadline', status: 'pending', projectName: 'A社 LPリニューアル' },
  { id: '2', date: '2026-04-15', title: '【B社】見積もり再提示・状況確認', type: 'followup', status: 'pending', projectName: 'B社 新規システム開発' },
  { id: '3', date: '2026-04-20', title: '【C社】保守契約のアップセル提案', type: 'upsell', status: 'pending', projectName: 'C社 サイト保守' },
  { id: '4', date: '2026-04-05', title: '【D社】要件定義書 提出', type: 'deadline', status: 'completed', projectName: 'D社 メディア構築' },
];

export default function ProjectsCalendarPage() {
  const [milestones, setMilestones] = useState(mockMilestones);

  const pending = milestones.filter(m => m.status === 'pending').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completed = milestones.filter(m => m.status === 'completed');

  const toggleStatus = (id: string, current: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: current === 'pending' ? 'completed' : 'pending' } : m));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>スケジュール・マイルストーン管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>すべての案件の「納期」「フォローアップ日」を横断して確認します。</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} /> 予定を手動追加
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '2rem' }}>
        
        {/* Main List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              <Clock size={20} color="var(--primary-color)" /> 直近の予定（未完了）
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pending.map(m => (
                <div key={m.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', borderLeft: m.type === 'deadline' ? '4px solid #EF4444' : m.type === 'upsell' ? '4px solid #F59E0B' : '4px solid #3B82F6' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => toggleStatus(m.id, m.status)}>
                    <Circle size={24} color="var(--surface-border)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px', fontWeight: 'bold' }}>{m.date} - {m.projectName}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{m.title}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                    {m.type === 'deadline' ? '納期' : m.type === 'upsell' ? '提案' : 'フォロー'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              完了済みの予定
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.6 }}>
              {completed.map(m => (
                <div key={m.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', background: '#F8FAFC' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => toggleStatus(m.id, m.status)}>
                    <CheckCircle2 size={24} color="#10B981" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px', textDecoration: 'line-through' }}>{m.date} - {m.projectName}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{m.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Upsell */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ background: 'linear-gradient(to bottom right, #F8FAFC, #FFFFFF)' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
              <Bell size={18} color="var(--primary-color)" /> リマインダー <span style={{ fontSize: '0.7rem', background: '#DBEAFE', color: 'var(--primary-dark)', padding: '2px 6px', borderRadius: '4px' }}>PRO</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Proプランでは、納期の3日前や「連絡が途絶えてから1週間後」などに、LINEやSlackへ自動でリマインド通知を送ることができます。
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              忘れがちな「失注後の再提案ループ」を自動化し、案件の取りこぼしを完全に防ぎます。
            </p>
            <button className="btn-secondary" style={{ width: '100%', marginTop: '0.5rem', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
              自動通知を有効にする
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

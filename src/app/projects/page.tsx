'use client';

import Link from 'next/link';
import { Calendar, CheckCircle2, Lock, Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>← ダッシュボードへ</Link>
            <h1>稼働中案件・マイルストーン管理</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>納期・フォローアップ予定日を手動で設定して忘却を防止。</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Project Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: '#D1FAE5', color: '#059669', borderRadius: '4px', fontWeight: 'bold' }}>稼働中</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>A社（直契約）</span>
              </div>
              <h2 style={{ margin: 0 }}>コーポレートサイトフルリニューアル要件定義・設計</h2>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                受注額: ¥800,000
              </div>
            </div>
            
            {/* Automatic Followup Upsell */}
            <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', padding: '12px', borderRadius: '6px', maxWidth: '280px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="var(--primary-color)"/> 自動フォローアップ通知 <span style={{ background: '#DBEAFE', color: 'var(--primary-color)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.65rem' }}>PRO</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                納品後や契約終了前に、継続案件を獲得するためのアップセル打診メールをAIが自動作成し、最適なタイミングで通知します。
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>カレンダー・マイルストーン (手動)</h4>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> 予定を追加
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#F8FAFC', border: '1px solid var(--surface-border)', padding: '12px 16px', borderRadius: '8px' }}>
               <CheckCircle2 size={24} color="#10B981" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>キックオフ＆ヒアリング完了</div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> 2026/04/01
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFFFFF', border: '1px solid var(--surface-border)', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #CBD5E1' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>ワイヤーフレーム初回提出</div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> 2026/04/15
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '8px' }}>
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>!</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#B91C1C' }}>手動設定：保守運用プランの打診</div>
                <div style={{ fontSize: '0.8rem', color: '#DC2626' }}>※忘れずに連絡を入れる（手動タスク）</div>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#B91C1C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> 2026/04/20
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

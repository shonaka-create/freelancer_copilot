'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialTemplates = [
  { id: '1', name: '基本の挨拶＆自己紹介', content: '初めまして。Webエンジニアとして〇〇年活動しております...' },
  { id: '2', name: 'ポートフォリオURL（開発）', content: '過去の開発実績については、以下のURLをご参照ください。\n- 実績1: ...\n- 実績2: ...' }
];

export default function TemplatesPage() {
  const [templates] = useState(initialTemplates);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>手動テンプレート管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>よく使う応募文のパーツを登録してコピペを楽に。</p>
        </div>
        <button className="btn-primary">+ 新規作成</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {templates.map(tmpl => (
          <div key={tmpl.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{tmpl.name}</h3>
            <div style={{ 
              background: '#F8FAFC', 
              padding: '12px', 
              borderRadius: '6px', 
              fontSize: '0.85rem', 
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              flex: 1
            }}>
              {tmpl.content}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '6px' }}>編集</button>
              <button className="btn-primary" style={{ flex: 1, padding: '6px' }}>コピーする</button>
            </div>
          </div>
        ))}

        {/* Upsell Teaser logic */}
        <div className="glass-panel" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          background: 'linear-gradient(to bottom right, #EFF6FF, #F8FAFC)',
          border: '1px dashed #BFDBFE'
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)' }}>AIスマートテンプレート <span style={{ fontSize: '0.7rem', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px' }}>PRO</span></h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
            案件の募集要項やあなたの過去の実績を分析し、**今回の案件に一番刺さる提案文**をAIが自動で生成・推敲します。<br/><br/>
            無料版での応募データが貯まるほど、生成精度が向上します。
          </p>
          <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
            Proプランにアップグレード
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientContext: 'CrowdWorksでのWebアプリ開発案件',
          jobDescription: 'Reactを使ったモダンなSPA開発。デザインはFigmaで提供済み。',
          pastSuccessExamples: '過去に似たようなSaaS開発経験があり、品質の高いUIを短納期で納品した実績あり。',
        }),
      });
      const data = await res.json();
      setProposal(data.proposal || data.error);
    } catch (e) {
      console.error(e);
      setProposal('エラーが発生しました。');
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>← ダッシュボードへ</Link>
            <h1>応募・CRM管理</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>各媒体での応募状況と選考フロー管理</p>
        </div>
        <button className="btn-primary" onClick={handleGenerate}>
          {isGenerating ? 'AI推敲中...' : '+ 応募文AI生成(デモ)'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Kanban Board like Columns */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>書類選考中 / 返信待ち</h3>
          
          <div style={{ background: '#F8FAFC', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>クラウドワークス</div>
            <h4 style={{ margin: '0.5rem 0' }}>React SPA開発</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>応募日: 2026/04/05</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>詳細</button>
              <button className="btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>追撃</button>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>商談中 / 面談</h3>
          
          <div style={{ background: '#F8FAFC', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>直営業(X)</div>
            <h4 style={{ margin: '0.5rem 0' }}>LPリニューアル</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>次回: 4/12 面談予定</p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>成約 / 見送り</h3>
          {/* Item */}
          <div style={{ background: '#F1F5F9', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: '8px', opacity: 0.8 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>ランサーズ</div>
            <h4 style={{ margin: '0.5rem 0' }}>WordPress構築</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>失注理由: 単価合わず</p>
          </div>
        </div>
        
      </div>

      {proposal && (
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
          <h3>生成された提案文（プレビュー）</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', background: '#F8FAFC', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: '8px' }}>
            {proposal}
          </pre>
        </div>
      )}
    </div>
  );
}

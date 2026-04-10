'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Info } from 'lucide-react';

export default function NewApplicationPage() {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    url: '',
    amount: '',
    proposalText: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('MVPデモ: 保存しました');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header>
        <Link href="/" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem' }}>← ダッシュボードへ</Link>
        <h1>新規案件の登録（応募・下書き）</h1>
        <p style={{ color: 'var(--text-secondary)' }}>応募先ごとに内容を記録して、成果を蓄積しましょう。</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>案件名 <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input 
              type="text" 
              required
              placeholder="例: React SPA開発ポータル"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>媒体・クライアント名 <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input 
              type="text" 
              required
              placeholder="例: クラウドワークス"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>案件URL</label>
            <input 
              type="url" 
              placeholder="https://..."
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>提示単価</label>
            <input 
              type="text" 
              placeholder="例: ¥300,000"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>送信した応募文（提案内容）</span>
              <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', background: '#EFF6FF', padding: '2px 8px', borderRadius: '99px' }}>
                <Sparkles size={12} /> AI蓄積対応
              </span>
            </div>
          </label>
          <textarea 
            rows={10}
            placeholder="募集要項に対する返答や、アピール文をここにコピーして保存しておきましょう。"
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--surface-border)', fontFamily: 'var(--font-body)', resize: 'vertical' }}
          ></textarea>
        </div>

        {/* Upsell Hint */}
        <div style={{ display: 'flex', gap: '12px', padding: '1rem', background: '#F8FAFC', border: '1px solid currentColor', color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.85rem' }}>
          <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>データの蓄積で営業をハックする</strong><br/>
            無料版で応募文と結果を記録し続けることで、あなた自身の「勝ちパターン」データが蓄積されます。有料プラン（Pro）では、この蓄積データを活用した高精度なAI推敲機能が利用できるようになります。
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn-secondary">下書きとして保存</button>
          <button type="submit" className="btn-primary">「応募中」に登録する</button>
        </div>
      </form>
    </div>
  );
}

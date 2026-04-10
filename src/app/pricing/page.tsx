'use client';

import { CheckCircle2, ChevronRight, Zap, Shield, Crown } from 'lucide-react';

export default function PricingPage() {
  const handleCheckout = () => {
    // Here we would normally redirect to Stripe Checkout session
    alert('【モック機能】ここでStripeのCheckoutページに遷移します。');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 1rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>プランを選んで、営業力をさらに加速させる</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>あなたのフェーズに合わせて最適なプランをご用意しました。<br/>いつでもキャンセル可能です。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'stretch' }}>
        
        {/* Free Plan */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', borderTop: '4px solid #CBD5E1' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>FREE</h2>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>¥0 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/月</span></div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>まずは管理の基礎を作りたい方へ</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {['案件のカンバン管理（無制限）', '定型文の保存（手動）', 'スケジュール管理', '毎日のPDCA記録'].map(feature => (
              <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} color="#CBD5E1" /> {feature}
              </li>
            ))}
          </ul>
          
          <button className="btn-secondary" disabled style={{ opacity: 0.5 }}>
            現在のプラン
          </button>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            padding: '2rem', 
            borderTop: '4px solid var(--primary-color)',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1)',
            transform: 'scale(1.02)'
          }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={20} /> PRO
              </h2>
              <span style={{ fontSize: '0.75rem', background: '#DBEAFE', color: 'var(--primary-dark)', padding: '4px 8px', borderRadius: '99px', fontWeight: 'bold' }}>一番人気</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>¥1,980 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/月</span></div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>案件受注率を最大化し、放置案件をゼロに</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <Zap size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> 案件に合わせたAI応募文生成
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <Shield size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> 毎週末のAI・PDCA分析レポート
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> 自動フォローアップ通知 (LINE / Slack)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--primary-color)" /> 全ての無料機能
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--primary-color)" /> 優先カスタマーサポート
            </li>
          </ul>
          
          <button className="btn-primary" onClick={handleCheckout} style={{ padding: '14px', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }}>
            カードでお支払い <ChevronRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}

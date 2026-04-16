'use client';

import { CheckCircle2, ChevronRight, Zap, Shield, Crown, Clock } from 'lucide-react';
import { usePlanStatus } from '@/lib/usePlanStatus';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { state, hydrated, startTrial, upgrade } = usePlanStatus();
  const router = useRouter();

  const handleCheckout = () => {
    // 実際のStripe連携時はここでCheckoutセッションへリダイレクト
    upgrade();
    alert('【モック】PRO プランへアップグレードしました！');
    router.push('/');
  };

  const handleStartTrial = () => {
    startTrial();
    alert('7日間の無料トライアルを開始しました！PRO機能をすべてお試しください。');
    router.push('/');
  };

  // PRO カラム下部のCTAを状態で切り替え
  const ProCTA = () => {
    if (!hydrated) return <div style={{ height: '52px' }} />;

    if (state.plan === 'pro') {
      return (
        <div style={{ padding: '14px', background: '#F0FDF4', border: '1px solid #6EE7B7', borderRadius: '8px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>
          👑 現在ご利用中のプランです
        </div>
      );
    }

    if (state.plan === 'trial') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px', background: '#F0FDF4', border: '1px solid #6EE7B7', borderRadius: '8px', textAlign: 'center', fontWeight: 700, color: '#059669', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Clock size={16} /> 試用中 — あと{state.daysLeft}日
          </div>
          <button className="btn-primary" onClick={handleCheckout} style={{ padding: '14px', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }}>
            そのままPROに移行する <ChevronRight size={18} />
          </button>
        </div>
      );
    }

    if (state.plan === 'trial_expired') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '10px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', textAlign: 'center', fontSize: '0.82rem', color: '#92400E' }}>
            7日間のトライアルが終了しました
          </div>
          <button className="btn-primary" onClick={handleCheckout} style={{ padding: '14px', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', boxShadow: '0 4px 14px 0 rgba(239,68,68,0.39)' }}>
            👑 PRO にアップグレード <ChevronRight size={18} />
          </button>
        </div>
      );
    }

    // free
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={handleStartTrial}
          style={{
            padding: '14px', fontSize: '1.05rem', fontWeight: 700, border: 'none', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
            color: '#fff', borderRadius: '8px',
            boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)',
          }}
        >
          👑 PRO を7日間試してみる
        </button>
        <button className="btn-secondary" onClick={handleCheckout} style={{ padding: '10px', fontSize: '0.88rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
          カードでお支払い（即時PRO） <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 1rem' }}>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>プランを選んで、営業力をさらに加速させる</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          あなたのフェーズに合わせて最適なプランをご用意しました。<br/>
          {state.plan === 'free' && '7日間の無料トライアルで、PRO機能をすべてお試しいただけます。'}
          {state.plan === 'trial' && `トライアル期間中です。残り${state.daysLeft}日間、PRO機能をご利用いただけます。`}
          {state.plan === 'trial_expired' && 'トライアル期間が終了しました。PRO機能を継続するにはアップグレードが必要です。'}
          {state.plan === 'pro' && 'PROプランをご利用中です。いつでもキャンセル可能です。'}
        </p>
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
            {state.plan === 'free' ? '現在のプラン' : '無料プランの内容'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel" style={{
          display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem',
          borderTop: state.plan === 'trial_expired'
            ? '4px solid #EF4444'
            : state.plan === 'pro' || state.plan === 'trial'
            ? '4px solid #10B981'
            : '4px solid var(--primary-color)',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1)',
          transform: 'scale(1.02)',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={20} /> PRO
              </h2>
              {state.plan === 'free' && (
                <span style={{ fontSize: '0.75rem', background: '#DBEAFE', color: 'var(--primary-dark)', padding: '4px 8px', borderRadius: '99px', fontWeight: 'bold' }}>7日間無料</span>
              )}
              {state.plan === 'trial' && (
                <span style={{ fontSize: '0.75rem', background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '99px', fontWeight: 'bold' }}>試用中</span>
              )}
              {state.plan === 'trial_expired' && (
                <span style={{ fontSize: '0.75rem', background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '99px', fontWeight: 'bold' }}>期限切れ</span>
              )}
              {state.plan === 'pro' && (
                <span style={{ fontSize: '0.75rem', background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '99px', fontWeight: 'bold' }}>ご利用中</span>
              )}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>¥1,980 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/月</span></div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>案件受注率を最大化し、放置案件をゼロに</p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <Zap size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> プロジェクトチームの作成・メンバー管理
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <Shield size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> ガントチャートでタスク進捗を一元管理
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> AI応募文生成・PDCA分析レポート
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} /> 自動フォローアップ通知 (LINE / Slack)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--primary-color)" /> 全ての無料機能（時間単価分析を含む）
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={18} color="var(--primary-color)" /> 優先カスタマーサポート
            </li>
          </ul>

          <ProCTA />
        </div>

      </div>

      {/* Trial notice */}
      {hydrated && state.plan === 'free' && (
        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          クレジットカード不要 · 7日後に自動で無料プランへ戻ります
        </div>
      )}
    </div>
  );
}

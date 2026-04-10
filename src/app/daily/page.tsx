'use client';

import { useState } from 'react';
import { CheckSquare, AlertCircle, TrendingUp, Search } from 'lucide-react';

export default function DailyPDCAPage() {
  const [records, setRecords] = useState([
    {
      id: '1',
      date: '2026-04-09',
      action: 'A社と商談、B社に提案文を3件送付',
      check: 'B社向けの提案文で、実績URLをもっと上に配置した方が反応が良さそうだと感じた。',
      actionNext: '明日はポートフォリオURLのテンプレートを修正し、最低5件アプローチする。'
    }
  ]);
  
  const [formData, setFormData] = useState({
    action: '',
    check: '',
    actionNext: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.action) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    setRecords(prev => [{
      id: String(Date.now()),
      date: today,
      ...formData
    }, ...prev]);
    
    setFormData({ action: '', check: '', actionNext: '' });
    alert('今日の積み上げを記録しました！');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header>
        <h1>毎日の積み上げ・PDCA記録</h1>
        <p style={{ color: 'var(--text-secondary)' }}>日々の行動量と気づきをストックし、営業の質を高めましょう。</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Input Form */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'flex-start' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary-color)" /> 新しい記録
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>本日の行動 (Do)</label>
              <textarea 
                value={formData.action}
                onChange={e => setFormData({ ...formData, action: e.target.value })}
                required
                placeholder="例: 新規案件に3件応募、A社の事前テスト完了など"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>気づき / 反省 (Check)</label>
              <textarea 
                value={formData.check}
                onChange={e => setFormData({ ...formData, check: e.target.value })}
                placeholder="例: 返信が遅いクライアントだった。次回から見極めを早くする。"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>次回の改善 (Action)</label>
              <textarea 
                value={formData.actionNext}
                onChange={e => setFormData({ ...formData, actionNext: e.target.value })}
                placeholder="例: 応募文テンプレートの冒頭を実績ベースにテンプレ修正する。"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--surface-border)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>記録を保存する</button>
          </form>
        </div>

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>過去の記録</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-disabled)' }} />
              <input type="text" placeholder="キーワード検索..." style={{ padding: '8px 10px 8px 32px', borderRadius: '20px', border: '1px solid var(--surface-border)', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {records.map(r => (
              <div key={r.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--primary-color)', color: 'white', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '99px', fontWeight: 'bold' }}>
                  {r.date}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '4px' }}>行動 (Do)</div>
                  <div style={{ fontSize: '0.95rem' }}>{r.action}</div>
                </div>
                {(r.check || r.actionNext) && <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '4px 0' }} />}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {r.check && (
                    <div style={{ background: '#FFF7ED', padding: '10px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#9A3412', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} /> 気づき (Check)
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#7C2D12' }}>{r.check}</div>
                    </div>
                  )}
                  {r.actionNext && (
                    <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckSquare size={14} /> 次の行動 (Action)
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#14532D' }}>{r.actionNext}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upsell for Analytics */}
          <div className="glass-panel" style={{ background: '#F8FAFC', border: '1px dashed var(--surface-border)', textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>自己分析AIレポート <span style={{ fontSize: '0.7rem', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>PRO</span></div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 auto', maxWidth: '400px' }}>
              Proプランでは、記録されたPDCAデータをAIが毎週末に分析し、あなたの営業における課題と最適なアプローチ方法をレポートとして自動生成します。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

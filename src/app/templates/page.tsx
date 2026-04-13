'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Save, Edit2, Check, Sparkles } from 'lucide-react';
import { usePlanStatus } from '@/lib/usePlanStatus';

const initialTemplates = [
  { id: '1', name: '基本の挨拶＆自己紹介', content: '初めまして。Webエンジニアとして〇〇年活動しております。\n\nこれまで〇〇の技術を中心にプロジェクトに参画してきました。' },
  { id: '2', name: 'ポートフォリオURL（開発）', content: '過去の開発実績については、以下のURLをご参照ください。\n- 実績1: https://...\n- 実績2: https://...' }
];

// PRO upsell card の表示内容をステータスで切り替えるコンポーネント
function AiTemplateCard({ isPro, state, onStartTrial, onUpgrade }: {
  isPro: boolean;
  state: { plan: string };
  onStartTrial: () => void;
  onUpgrade: () => void;
}) {
  if (isPro) {
    return (
      <div className="glass-panel" style={{
        display: 'flex', flexDirection: 'column', gap: '1rem',
        background: 'linear-gradient(to bottom right, #F0FDF4, #F8FAFC)',
        border: '1px solid #6EE7B7',
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} /> AIスマートテンプレート
          <span style={{ fontSize: '0.7rem', background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '4px' }}>
            {state.plan === 'trial' ? '試用中' : 'PRO'}
          </span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
          案件の募集要項やあなたの過去の実績を分析し、今回の案件に一番刺さる提案文をAIが自動で生成・推敲します。
        </p>
        <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Sparkles size={14} /> AI提案文を生成する
        </button>
      </div>
    );
  }

  if (state.plan === 'trial_expired') {
    return (
      <div className="glass-panel" style={{
        display: 'flex', flexDirection: 'column', gap: '1rem',
        background: 'linear-gradient(to bottom right, #FFF7ED, #F8FAFC)',
        border: '1px dashed #FED7AA',
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)' }}>
          AIスマートテンプレート <span style={{ fontSize: '0.7rem', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px' }}>期限切れ</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
          トライアル期間が終了しました。PROプランに移行するとAIテンプレート機能が再度ご利用いただけます。
        </p>
        <button className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }} onClick={onUpgrade}>
          👑 PRO にアップグレード
        </button>
      </div>
    );
  }

  // free
  return (
    <div className="glass-panel" style={{
      display: 'flex', flexDirection: 'column', gap: '1rem',
      background: 'linear-gradient(to bottom right, #EFF6FF, #F8FAFC)',
      border: '1px dashed #BFDBFE',
    }}>
      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)' }}>
        AIスマートテンプレート <span style={{ fontSize: '0.7rem', background: '#DBEAFE', padding: '2px 6px', borderRadius: '4px' }}>PRO</span>
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
        案件の募集要項やあなたの過去の実績を分析し、今回の案件に一番刺さる提案文をAIが自動で生成・推敲します。<br/><br/>
        無料版での応募データが貯まるほど、生成精度が向上します。
      </p>
      <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }} onClick={onStartTrial}>
        👑 PRO を7日間試してみる
      </button>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const { state, isPro, startTrial } = usePlanStatus();
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleEditClick = (id: string, content: string) => {
    setEditingId(id); setEditContent(content);
  };
  const handleSave = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, content: editContent } : t));
    setEditingId(null);
  };
  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { alert('コピーに失敗しました'); }
  };

  const handleStartTrial = () => { startTrial(); };
  const handleUpgrade = () => { router.push('/pricing'); };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>手動テンプレート管理</h1>
          <p style={{ color: 'var(--text-secondary)' }}>よく使う応募文のパーツを登録してコピペを楽に。</p>
        </div>
        <button className="btn-primary" onClick={() => {
          const newId = String(Date.now());
          setTemplates(prev => [...prev, { id: newId, name: '新しいテンプレート', content: '' }]);
          handleEditClick(newId, '');
        }}>+ 新規作成</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {templates.map(tmpl => (
          <div key={tmpl.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{tmpl.name}</h3>
            {editingId === tmpl.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{ background: '#FFFFFF', border: '1px solid var(--primary-color)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'var(--font-body)', resize: 'vertical', minHeight: '120px', outline: 'none' }}
              />
            ) : (
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', flex: 1, minHeight: '120px' }}>
                {tmpl.content || <span style={{ color: 'var(--text-disabled)', fontStyle: 'italic' }}>テキストがありません</span>}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingId === tmpl.id ? (
                <button className="btn-primary" style={{ flex: 1, padding: '6px' }} onClick={() => handleSave(tmpl.id)}>
                  <Save size={16} /> 保存する
                </button>
              ) : (
                <>
                  <button className="btn-secondary" style={{ flex: 1, padding: '6px' }} onClick={() => handleEditClick(tmpl.id, tmpl.content)}>
                    <Edit2 size={16} /> 編集
                  </button>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, padding: '6px', background: copiedId === tmpl.id ? 'var(--success-color)' : 'var(--primary-color)' }}
                    onClick={() => handleCopy(tmpl.id, tmpl.content)}
                  >
                    {copiedId === tmpl.id ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === tmpl.id ? ' コピー完了' : ' コピーする'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <AiTemplateCard
          isPro={isPro}
          state={state}
          onStartTrial={handleStartTrial}
          onUpgrade={handleUpgrade}
        />
      </div>
    </div>
  );
}

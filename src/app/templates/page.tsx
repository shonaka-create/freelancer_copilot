'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Save, Edit2, Check, Sparkles, X, Wand2 } from 'lucide-react';
import { usePlanStatus } from '@/lib/usePlanStatus';

// ─── Types ───────────────────────────────────────────────────────────────────
type Template = { id: string; name: string; content: string };

type AiProfile = {
  experienceYears: string;
  techStack: string;
  strength: string;
  achievement: string;
  portfolioUrl1: string;
  portfolioTitle1: string;
  portfolioUrl2: string;
  portfolioTitle2: string;
  projectType: string;
};

// ─── Persistence ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'af_templates';

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    name: '基本の挨拶＆自己紹介',
    content: '初めまして。Webエンジニアとして〇〇年活動しております。\n\nこれまで〇〇の技術を中心にプロジェクトに参画してきました。',
  },
  {
    id: '2',
    name: 'ポートフォリオURL（開発）',
    content: '過去の開発実績については、以下のURLをご参照ください。\n- 実績1: https://...\n- 実績2: https://...',
  },
];

function loadTemplates(): Template[] {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TEMPLATES;
    const parsed = JSON.parse(raw) as Template[];
    return parsed.length ? parsed : DEFAULT_TEMPLATES;
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

function saveTemplates(templates: Template[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch { /* quota */ }
}

// ─── AI Generation Logic (PASONA / Credibility-First framework) ───────────────
function generateGreeting(profile: AiProfile): string {
  const { experienceYears, techStack, strength, achievement, projectType } = profile;

  const projectHook: Record<string, string> = {
    web: 'フロントエンド〜バックエンドまで一気通貫で対応できる点',
    mobile: 'モバイルUXの細部にまでこだわった実装ができる点',
    data: 'データの収集・分析・可視化まで一貫して担える点',
    infra: 'クラウド設計からCI/CD構築まで自走できる点',
    other: '要件定義から実装・リリースまで一貫して担える点',
  };
  const hook = projectHook[projectType] || projectHook.other;

  return `はじめまして。${techStack}を専門とするエンジニアです。

▍経験・実績
${experienceYears}年間、${techStack}を中心に${projectType === 'web' ? 'Webサービス開発' : projectType === 'mobile' ? 'モバイルアプリ開発' : projectType === 'data' ? 'データ分析・可視化' : projectType === 'infra' ? 'インフラ構築・運用' : 'システム開発'}に携わってきました。
特に「${strength}」を強みとしており、${achievement}を実現した実績があります。

▍今回のご提案について
今回のプロジェクトには、${hook}が今回の課題解決に直結すると感じ、ご連絡いたしました。

納期・品質を最優先に、コミュニケーションを密にとりながら進めることを心がけています。
ご不明点や詳細のすり合わせなど、お気軽にお声がけください。よろしくお願いいたします。`;
}

function generatePortfolio(profile: AiProfile): string {
  const { portfolioUrl1, portfolioTitle1, portfolioUrl2, portfolioTitle2, techStack, achievement } = profile;

  const lines: string[] = [
    `これまでの開発実績をご紹介します（${techStack}を中心とした案件です）。`,
    '',
  ];

  if (portfolioTitle1 && portfolioUrl1) {
    lines.push(`■ ${portfolioTitle1}`);
    lines.push(`   ${portfolioUrl1}`);
    lines.push('');
  }
  if (portfolioTitle2 && portfolioUrl2) {
    lines.push(`■ ${portfolioTitle2}`);
    lines.push(`   ${portfolioUrl2}`);
    lines.push('');
  }

  lines.push(`いずれも「${achievement}」という成果に直結した取り組みです。`);
  lines.push('実装の詳細や技術的な背景については、お気軽にご質問ください。');

  return lines.join('\n');
}

// ─── AI Generator Modal ───────────────────────────────────────────────────────
const BLANK_PROFILE: AiProfile = {
  experienceYears: '',
  techStack: '',
  strength: '',
  achievement: '',
  portfolioUrl1: '',
  portfolioTitle1: '',
  portfolioUrl2: '',
  portfolioTitle2: '',
  projectType: 'web',
};

function AiGeneratorModal({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: (greeting: string, portfolio: string) => void;
}) {
  const [profile, setProfile] = useState<AiProfile>(BLANK_PROFILE);
  const [generating, setGenerating] = useState(false);

  const set = (key: keyof AiProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setProfile(prev => ({ ...prev, [key]: e.target.value }));

  const handleGenerate = () => {
    if (!profile.experienceYears || !profile.techStack || !profile.strength || !profile.achievement) return;
    setGenerating(true);
    // 短いディレイで生成中感を演出
    setTimeout(() => {
      const greeting = generateGreeting(profile);
      const portfolio = generatePortfolio(profile);
      onGenerate(greeting, portfolio);
      setGenerating(false);
      onClose();
    }, 900);
  };

  const isValid = profile.experienceYears && profile.techStack && profile.strength && profile.achievement;

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '6px',
    border: '1px solid var(--surface-border)', fontFamily: 'inherit',
    fontSize: '0.9rem', background: '#fff', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.82rem', fontWeight: 700,
    marginBottom: '5px', color: 'var(--text-primary)',
  };
  const requiredMark = <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '580px',
        maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>

        <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
          <Sparkles size={18} /> AIスマートテンプレート生成
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem' }}>
          あなたの情報を入力すると、PASONA法則・実績訴求型の応募文を自動生成します。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>経験年数{requiredMark}</label>
              <input style={fieldStyle} placeholder="例: 5" value={profile.experienceYears} onChange={set('experienceYears')} />
            </div>
            <div>
              <label style={labelStyle}>対象プロジェクト種別{requiredMark}</label>
              <select style={fieldStyle} value={profile.projectType} onChange={set('projectType')}>
                <option value="web">Web開発</option>
                <option value="mobile">モバイルアプリ</option>
                <option value="data">データ分析</option>
                <option value="infra">インフラ・クラウド</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>主な技術スタック{requiredMark}</label>
            <input style={fieldStyle} placeholder="例: React / Next.js / TypeScript / PostgreSQL" value={profile.techStack} onChange={set('techStack')} />
          </div>

          <div>
            <label style={labelStyle}>強み・得意領域{requiredMark}</label>
            <input style={fieldStyle} placeholder="例: パフォーマンス最適化・レスポンシブUI設計" value={profile.strength} onChange={set('strength')} />
          </div>

          <div>
            <label style={labelStyle}>具体的な実績（数字を含めると効果的）{requiredMark}</label>
            <textarea style={{ ...fieldStyle, minHeight: '70px', resize: 'vertical' }}
              placeholder="例: ECサイトの表示速度を40%改善し、CVRを1.8倍に向上"
              value={profile.achievement} onChange={set('achievement')}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--surface-border)', margin: '0.5rem 0' }} />

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 700 }}>ポートフォリオURL（任意）</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>実績タイトル 1</label>
              <input style={fieldStyle} placeholder="例: ECサイトリニューアル" value={profile.portfolioTitle1} onChange={set('portfolioTitle1')} />
            </div>
            <div>
              <label style={labelStyle}>URL 1</label>
              <input style={fieldStyle} placeholder="https://..." value={profile.portfolioUrl1} onChange={set('portfolioUrl1')} />
            </div>
            <div>
              <label style={labelStyle}>実績タイトル 2</label>
              <input style={fieldStyle} placeholder="例: 管理システム開発" value={profile.portfolioTitle2} onChange={set('portfolioTitle2')} />
            </div>
            <div>
              <label style={labelStyle}>URL 2</label>
              <input style={fieldStyle} placeholder="https://..." value={profile.portfolioUrl2} onChange={set('portfolioUrl2')} />
            </div>
          </div>
        </div>

        <button
          className="btn-primary"
          disabled={!isValid || generating}
          onClick={handleGenerate}
          style={{ width: '100%', marginTop: '1.5rem', padding: '12px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isValid ? 1 : 0.5 }}
        >
          <Wand2 size={16} />
          {generating ? '生成中...' : 'テンプレートを生成する'}
        </button>
      </div>
    </div>
  );
}

// ─── AI Card (plan-aware) ─────────────────────────────────────────────────────
function AiTemplateCard({
  isPro, state, onStartTrial, onUpgrade, onOpenModal,
}: {
  isPro: boolean;
  state: { plan: string };
  onStartTrial: () => void;
  onUpgrade: () => void;
  onOpenModal: () => void;
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
          あなたの実績・強みを入力するだけで、採用担当者の心を動かす応募文をAIが自動生成します。PASONA法則・実績訴求型の2種類のテンプレートを上書き更新します。
        </p>
        <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={onOpenModal}>
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
        実績・強みを入力するだけで、PASONA法則に基づく採用担当者の心を動かす応募文をAIが自動生成します。<br /><br />
        無料版での応募データが貯まるほど、生成精度が向上します。
      </p>
      <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }} onClick={onStartTrial}>
        👑 PRO を7日間試してみる
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TemplatesPage() {
  const router = useRouter();
  const { state, isPro, startTrial } = usePlanStatus();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    setTemplates(loadTemplates());
    setHydrated(true);
  }, []);

  const updateAndSave = (next: Template[]) => {
    setTemplates(next);
    saveTemplates(next);
  };

  const handleEditClick = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSave = (id: string) => {
    const next = templates.map(t => t.id === id ? { ...t, content: editContent } : t);
    updateAndSave(next);
    setEditingId(null);
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('コピーに失敗しました');
    }
  };

  const handleAddNew = () => {
    const newId = String(Date.now());
    const next = [...templates, { id: newId, name: '新しいテンプレート', content: '' }];
    updateAndSave(next);
    handleEditClick(newId, '');
  };

  // AI生成結果を「基本の挨拶」「ポートフォリオURL」に上書き
  const handleAiGenerate = (greeting: string, portfolio: string) => {
    const next = templates.map(t => {
      if (t.id === '1') return { ...t, content: greeting };
      if (t.id === '2') return { ...t, content: portfolio };
      return t;
    });
    updateAndSave(next);
  };

  return (
    <>
      {showAiModal && (
        <AiGeneratorModal
          onClose={() => setShowAiModal(false)}
          onGenerate={handleAiGenerate}
        />
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>手動テンプレート管理</h1>
            <p style={{ color: 'var(--text-secondary)' }}>よく使う応募文のパーツを登録してコピペを楽に。</p>
          </div>
          <button className="btn-primary" onClick={handleAddNew}>+ 新規作成</button>
        </header>

        {!hydrated ? (
          <div style={{ color: 'var(--text-disabled)', fontSize: '0.85rem' }}>読み込み中...</div>
        ) : (
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
                    <button className="btn-primary" style={{ flex: 1, padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onClick={() => handleSave(tmpl.id)}>
                      <Save size={16} /> 保存する
                    </button>
                  ) : (
                    <>
                      <button className="btn-secondary" style={{ flex: 1, padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onClick={() => handleEditClick(tmpl.id, tmpl.content)}>
                        <Edit2 size={16} /> 編集
                      </button>
                      <button
                        className="btn-primary"
                        style={{ flex: 1, padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: copiedId === tmpl.id ? 'var(--success-color)' : 'var(--primary-color)' }}
                        onClick={() => handleCopy(tmpl.id, tmpl.content)}
                      >
                        {copiedId === tmpl.id ? <Check size={16} /> : <Copy size={16} />}
                        {copiedId === tmpl.id ? 'コピー完了' : 'コピーする'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            <AiTemplateCard
              isPro={isPro}
              state={state}
              onStartTrial={() => startTrial()}
              onUpgrade={() => router.push('/pricing')}
              onOpenModal={() => setShowAiModal(true)}
            />
          </div>
        )}
      </div>
    </>
  );
}

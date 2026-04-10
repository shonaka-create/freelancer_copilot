'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getApplications, updateApplicationStatus } from '@/app/actions';

const initialColumns = [
  { id: 'applied', title: '応募中' },
  { id: 'negotiating', title: '商談中' },
  { id: 'active', title: '稼働中' },
  { id: 'completed', title: '完了 / 失注' }
];

const mockTasks = [
  { id: 'mock-1', status: 'applied', title: 'React SPA開発ポータル', platform: 'クラウドワークス', description: 'https://...\n¥300,000' },
  { id: 'mock-2', status: 'applied', title: 'コーポレートサイト保守', platform: 'ランサーズ', description: 'https://...\n¥100,000' },
  { id: 'mock-3', status: 'negotiating', title: 'LPリニューアル', platform: '直営業(X)', description: 'https://...\n¥150,000' },
  { id: 'mock-4', status: 'negotiating', title: '新規メディア立ち上げ設計', platform: 'A社紹介', description: 'https://...\n¥500,000' },
  { id: 'mock-5', status: 'active', title: 'コーポレートサイト要件定義', platform: '株式会社テック', description: 'https://...\n¥800,000' },
  { id: 'mock-6', status: 'active', title: 'Vue -> React 移行', platform: 'B株式会社', description: 'https://...\n¥1,200,000' },
  { id: 'mock-7', status: 'completed', title: 'WordPressブログ構築', platform: 'クラウドワークス', description: 'https://...\n¥80,000' },
  { id: 'mock-8', status: 'completed', title: 'SNS運用代行ツール開発', platform: 'C社', description: 'https://...\n失注' },
];

function DroppableColumn({ column, children }: any) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });
  const style = {
    minWidth: '280px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    backgroundColor: isOver ? '#E2E8F0' : '#F1F5F9',
    padding: '16px',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

function DraggableTask({ task }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    background: '#FFFFFF',
    border: '1px solid var(--surface-border)',
    borderRadius: '6px',
    padding: '12px',
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
    cursor: 'grab',
    opacity: isDragging ? 0.4 : 1,
  };

  // We temporarily merge url + amount into description for display MVP
  const amount = task.description?.split('\n')[1] || '';

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '4px' }}>{task.platform || '設定なし'}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>{task.title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{amount}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tasks from Supabase
    getApplications().then(data => {
      // DBが空の場合はモックデータを表示する（MVP用）
      if (data && data.length > 0) {
        setTasks(data);
      } else {
        setTasks(mockTasks);
      }
      setLoading(false);
    });
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 }}));

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    // dropped outside a column or no change
    if (!over || active.id == null || !tasks.find(t => t.id === active.id)) return;
    
    const task = tasks.find(t => t.id === active.id);
    if (!task) return;
    
    const oldStatus = task.status;
    const newStatus = over.id;

    if (oldStatus === newStatus) return;

    // Optimistic UI Update
    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus } : t));

    // Mock data check (avoid saving to DB for demo data)
    if (String(active.id).startsWith('mock-')) return;

    // Save to Supabase
    const result = await updateApplicationStatus(active.id, newStatus);
    if (!result.success) {
      alert('ステータス更新に失敗しました。RLSの制限などを確認してください。');
      // Revert if UI update failed
      setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: oldStatus } : t));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1>案件ダッシュボード (Kanban)</h1>
            <span style={{ fontSize: '0.75rem', background: '#DBEAFE', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Supabase 連携済</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>進行中の案件ステータスをドラッグ＆ドロップで管理</p>
        </div>
        <Link href="/applications/new" className="btn-primary">
          + 新しい案件を登録
        </Link>
      </header>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>読込中...</div>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          overflowX: 'auto', 
          paddingBottom: '1rem',
          minHeight: '60vh'
        }}>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {initialColumns.map(column => {
              // Now mapped using 'status' instead of 'columnId'
              const colTasks = tasks.filter(t => t.status === column.id);
              return (
                <DroppableColumn key={column.id} column={column}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{column.title}</h3>
                    <span style={{ fontSize: '0.8rem', background: '#E2E8F0', padding: '2px 8px', borderRadius: '99px', color: 'var(--text-secondary)' }}>{colTasks.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '50px' }}>
                    {colTasks.map(task => (
                      <DraggableTask key={task.id} task={task} />
                    ))}
                    {colTasks.length === 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-disabled)', textAlign: 'center', margin: '2rem 0' }}>ドロップ可能</div>
                    )}
                  </div>
                </DroppableColumn>
              );
            })}
            <DragOverlay>
              {activeTask ? (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--primary-color)',
                  borderRadius: '6px',
                  padding: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transform: 'scale(1.05)',
                  cursor: 'grabbing'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '4px' }}>{activeTask.platform}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>{activeTask.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                     {activeTask.description?.split('\n')[1] || ''}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}

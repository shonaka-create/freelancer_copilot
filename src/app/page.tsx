'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const initialColumns = [
  { id: 'applied', title: '応募中' },
  { id: 'negotiating', title: '商談中' },
  { id: 'active', title: '稼働中' },
  { id: 'completed', title: '完了 / 失注' }
];

const initialTasks = [
  { id: '1', columnId: 'applied', title: 'React SPA開発', client: 'クラウドワークス', amount: '¥300,000' },
  { id: '2', columnId: 'negotiating', title: 'LPリニューアル', client: '直営業(X)', amount: '¥150,000' },
  { id: '3', columnId: 'active', title: 'コーポレートサイト要件定義', client: 'A社', amount: '¥800,000' },
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

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '4px' }}>{task.client}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>{task.title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.amount}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 }}));

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    if (over && active.id) {
      setTasks(prev => prev.map(t => t.id === active.id ? { ...t, columnId: over.id } : t));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>案件ダッシュボード (Kanban)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>進行中の案件ステータスをドラッグ＆ドロップで管理</p>
        </div>
        <Link href="/applications/new" className="btn-primary">
          + 新しい案件を登録
        </Link>
      </header>

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
            const colTasks = tasks.filter(t => t.columnId === column.id);
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
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '4px' }}>{activeTask.client}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>{activeTask.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeTask.amount}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

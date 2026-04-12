'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TYPE_COLOR: Record<string, string> = {
  deadline: '#EF4444',
  followup: '#3B82F6',
  upsell:   '#F59E0B',
};
const TYPE_LABEL: Record<string, string> = {
  deadline: '納期',
  followup: 'フォロー',
  upsell:   '提案',
};

const mockEvents = [
  { id: '1', date: '2026-04-12', title: '【A社】LP初回納品',      type: 'deadline', status: 'pending',   projectName: 'A社 LPリニューアル' },
  { id: '2', date: '2026-04-15', title: '【B社】見積もり再提示',   type: 'followup', status: 'pending',   projectName: 'B社 新規システム開発' },
  { id: '3', date: '2026-04-20', title: '【C社】アップセル提案',   type: 'upsell',   status: 'pending',   projectName: 'C社 サイト保守' },
  { id: '4', date: '2026-04-05', title: '【D社】要件定義書提出',   type: 'deadline', status: 'completed', projectName: 'D社 メディア構築' },
];

const WEEK_DAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear]           = useState(today.getFullYear());
  const [month, setMonth]         = useState(today.getMonth());
  const [selectedDay, setSelected] = useState<number | null>(today.getDate());
  const router = useRouter();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); };

  // Build 42-cell grid
  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  type Cell = { day: number; kind: 'prev' | 'cur' | 'next' };
  const cells: Cell[] = [];
  for (let i = firstDow - 1; i >= 0; i--)       cells.push({ day: daysInPrev - i, kind: 'prev' });
  for (let d = 1; d <= daysInMonth; d++)          cells.push({ day: d, kind: 'cur' });
  for (let d = 1; cells.length < 42; d++)         cells.push({ day: d, kind: 'next' });

  // Index events by day
  const byDay: Record<number, typeof mockEvents> = {};
  mockEvents.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      (byDay[day] ??= []).push(ev);
    }
  });

  const selectedEvents = selectedDay ? (byDay[selectedDay] ?? []) : [];
  const upcoming = mockEvents
    .filter(e => e.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>カレンダー</h1>
          <p style={{ color: 'var(--text-secondary)' }}>案件の納期・フォローアップ日を一覧で把握</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          + 予定を追加
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Calendar ── */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>

          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex' }}>
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{year}年 {MONTH_NAMES[month]}</h2>
            <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
            {WEEK_DAYS.map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, padding: '4px 0',
                color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : 'var(--text-secondary)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((cell, idx) => {
              const isCur      = cell.kind === 'cur';
              const isSelected = isCur && selectedDay === cell.day;
              const isTodayCell = isCur && isToday(cell.day);
              const dayEvs     = isCur ? (byDay[cell.day] ?? []) : [];
              const isSun      = idx % 7 === 0;
              const isSat      = idx % 7 === 6;

              return (
                <div
                  key={idx}
                  onClick={() => isCur && setSelected(cell.day)}
                  style={{
                    minHeight: '76px',
                    padding: '5px',
                    borderRadius: '6px',
                    cursor: isCur ? 'pointer' : 'default',
                    opacity: isCur ? 1 : 0.25,
                    background: isSelected ? '#EFF6FF' : 'transparent',
                    border: isSelected
                      ? '1.5px solid var(--primary-color)'
                      : isTodayCell
                      ? '1.5px solid #10B981'
                      : '1.5px solid transparent',
                    transition: 'background 0.12s',
                  }}
                >
                  {/* Day number */}
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', marginBottom: '3px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.82rem',
                    fontWeight: isTodayCell ? 700 : 400,
                    background: isTodayCell ? '#DCFCE7' : 'transparent',
                    color: isTodayCell ? '#10B981' : isSun ? '#EF4444' : isSat ? '#3B82F6' : 'var(--text-primary)',
                  }}>
                    {cell.day}
                  </div>

                  {/* Event chips */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dayEvs.slice(0, 2).map(ev => (
                      <div key={ev.id} style={{
                        fontSize: '0.62rem', padding: '1px 4px', borderRadius: '3px',
                        background: TYPE_COLOR[ev.type] + '22',
                        color: TYPE_COLOR[ev.type],
                        fontWeight: 600,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        opacity: ev.status === 'completed' ? 0.45 : 1,
                        textDecoration: ev.status === 'completed' ? 'line-through' : 'none',
                      }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvs.length > 2 && (
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', paddingLeft: '4px' }}>+{dayEvs.length - 2}件</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
            {Object.entries(TYPE_LABEL).map(([key, label]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: TYPE_COLOR[key] }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Selected day detail */}
          <div className="glass-panel">
            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
              {selectedDay ? `${month + 1}月${selectedDay}日の予定` : '日付を選択'}
            </h3>
            {selectedEvents.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-disabled)', margin: 0 }}>予定なし</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedEvents.map(ev => (
                  <div key={ev.id} style={{ borderLeft: `3px solid ${TYPE_COLOR[ev.type]}`, paddingLeft: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: '1px' }}>{ev.projectName}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600,
                      textDecoration: ev.status === 'completed' ? 'line-through' : 'none',
                      color: ev.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)'
                    }}>{ev.title}</div>
                    <span style={{ fontSize: '0.65rem', background: TYPE_COLOR[ev.type] + '22', color: TYPE_COLOR[ev.type], padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {TYPE_LABEL[ev.type]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming list */}
          <div className="glass-panel">
            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>直近の予定</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcoming.map(ev => (
                <div key={ev.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLOR[ev.type], flexShrink: 0, marginTop: '5px' }} />
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{ev.date}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ev.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRO upsell */}
          <div className="glass-panel" style={{ background: 'linear-gradient(to bottom right, #EFF6FF, #F8FAFC)', border: '1px dashed #BFDBFE' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={15} color="var(--primary-color)" /> リマインダー
              <span style={{ fontSize: '0.63rem', background: '#DBEAFE', color: 'var(--primary-dark)', padding: '2px 6px', borderRadius: '4px' }}>PRO</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
              納期前・フォロー忘れをLINE/Slackへ自動通知。
            </p>
            <button
              className="btn-secondary"
              style={{ width: '100%', borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontSize: '0.82rem' }}
              onClick={() => router.push('/pricing')}
            >
              自動通知を有効にする
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

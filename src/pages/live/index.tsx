import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import LiveStats from './LiveStats';
import CallTable from './CallTable';
import Icon from '../../assets/icons';
import { statusPool, avatarColors, pick, rand, generateCall } from '../../utils/mockData';

export default function LiveCallsPage() {
  const { calls, setCalls, currentView } = useApp();
  const [flashIds, setFlashIds] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const timerRef = useRef(null);

  const counts = {
    total:      calls.length + 95,
    completed:  calls.filter(c => c.status === 'completed').length + 52,
    inprogress: calls.filter(c => c.status === 'inprogress').length + 3,
    declined:   calls.filter(c => c.status === 'declined').length + 18,
    pending:    calls.filter(c => ['noanswer','rescheduled'].includes(c.status)).length + 22,
  };

  // Live tick simulation
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (currentView !== 'live') return;
      const action = Math.random();

      if (action < 0.6) {
        // Update random in-progress → completed/etc
        setCalls(prev => {
          const inProg = prev.filter(c => c.status === 'inprogress');
          const toUpdate = inProg.length > 0 ? pick(inProg) : pick(prev.filter(c => c.status !== 'inprogress'));
          if (!toUpdate) return prev;

          const newStatus = inProg.length > 0
            ? pick(['completed','noanswer','rescheduled','followup'])
            : 'inprogress';
          const statusDef = statusPool.find(s => s.key === newStatus);
          const updated = {
            ...toUpdate,
            status:    newStatus,
            statusTxt: statusDef.txt,
            outcome:   pick(statusDef.outcomes),
            duration:  newStatus === 'inprogress' ? 'live' : `${rand(8)+1}m ${rand(59)}s`,
          };
          setFlashIds(f => new Set([...f, updated.id]));
          setTimeout(() => setFlashIds(f => { const n = new Set(f); n.delete(updated.id); return n; }), 1300);
          return prev.map(c => c.id === toUpdate.id ? updated : c);
        });
      } else {
        // Add new call row at top
        const newCall = generateCall(Date.now());
        setFlashIds(f => new Set([...f, newCall.id]));
        setTimeout(() => setFlashIds(f => { const n = new Set(f); n.delete(newCall.id); return n; }), 1300);
        setCalls(prev => [newCall, ...prev].slice(0, 16));
      }
    }, 2500);
    return () => clearInterval(timerRef.current);
  }, [currentView, setCalls]);

  const filterBtns = [
    { key: 'all',        label: 'All',        cnt: counts.total },
    { key: 'completed',  label: 'Completed',  cnt: counts.completed },
    { key: 'inprogress', label: 'In Progress',cnt: counts.inprogress },
    { key: 'declined',   label: 'Declined',   cnt: counts.declined },
    { key: 'pending',    label: 'Pending',    cnt: counts.pending },
  ];

  const actionBtns = [
    { icon: 'filter',  label: 'Filter' },
    { icon: 'refresh', label: 'Refresh' },
    { icon: 'export',  label: 'Export CSV' },
  ];

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--blue)', marginBottom: 10 }}>
          Voice Campaign · Live
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>
          Senior Frontend Screening
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 15, marginTop: 8 }}>
          248 candidates · Started 42 min ago · Est. 18 min remaining
        </p>
      </div>

      {/* Filter + action controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {filterBtns.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: '7px 12px', borderRadius: 99,
              background: activeFilter === f.key ? 'var(--tint-4)' : 'var(--tint-2)',
              border: activeFilter === f.key ? '1px solid var(--border-strong)' : '1px solid var(--border)',
              color: activeFilter === f.key ? 'var(--text-1)' : 'var(--text-2)',
              cursor: 'pointer', fontSize: 12.5,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            {f.label}
            <span
              style={{
                fontSize: 10.5, padding: '1px 6px', borderRadius: 99,
                background: activeFilter === f.key ? 'var(--purple)' : 'var(--tint-4)',
                color: activeFilter === f.key ? '#fff' : 'var(--text-3)',
              }}
            >
              {f.cnt}
            </span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {actionBtns.map(({ icon, label }) => (
          <button
            key={icon}
            style={{
              padding: '7px 12px', borderRadius: 99,
              background: 'var(--tint-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)', cursor: 'pointer', fontSize: 12.5,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <Icon name={icon} size={12} /> {label}
          </button>
        ))}
      </div>

      <LiveStats counts={counts} />
      <CallTable calls={calls} flashIds={flashIds} />
    </div>
  );
}

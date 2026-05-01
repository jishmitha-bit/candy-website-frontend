import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../assets/icons';

const crumbMap = {
  dashboard: [{ t: 'Home' }, { t: 'Dashboard', current: true }],
  hr:        [{ t: 'Home' }, { t: 'HR & Hiring' }, { t: 'Candidate Screening', current: true }],
  live:      [{ t: 'Home' }, { t: 'Voice Bots' }, { t: 'Live Campaign', current: true }],
};

export default function Topbar() {
  const { currentView, addToast } = useApp();
  const crumbs = crumbMap[currentView] ?? crumbMap.dashboard;

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.topbar-search-input')?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <header
      style={{
        height: 64,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.6)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-3)' }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <span style={{ color: 'var(--text-4)' }}>/</span>}
            <span style={c.current ? { color: 'var(--text-1)', fontWeight: 500 } : {}}>{c.t}</span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div
        className="topbar-search"
        style={{
          flex: 1, maxWidth: 520,
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid var(--border-strong)',
          borderRadius: 10,
          padding: '9px 14px',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--border-accent)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(117,91,227,0.1)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'var(--border-strong)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Icon name="search" size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
        <input
          className="topbar-search-input"
          placeholder="Search or ask AI…"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-1)', fontSize: 14,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, padding: '3px 6px',
            border: '1px solid var(--border-strong)', borderRadius: 5,
            color: 'var(--text-3)', background: 'rgba(255,255,255,0.03)',
          }}
        >
          ⌘ K
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {[
          { icon: 'zap',  tip: "What's new" },
          { icon: 'bell', tip: 'Notifications', dot: true },
          { icon: 'help', tip: 'Help' },
        ].map(({ icon, tip, dot }) => (
          <button
            key={icon}
            className="tooltip-wrap"
            data-tip={tip}
            onClick={() => addToast(`${tip} — coming soon`, 'info')}
            style={{
              width: 38, height: 38,
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-2)',
              display: 'grid', placeItems: 'center',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.15s',
            }}
          >
            <Icon name={icon} size={16} />
            {dot && (
              <span
                style={{
                  position: 'absolute', top: 9, right: 10,
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--blue)',
                  boxShadow: '0 0 10px var(--blue)',
                }}
              />
            )}
          </button>
        ))}

        <div
          className="tooltip-wrap"
          data-tip="Hello (hello@spacemarvel.ai)"
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--grad-pink)',
            display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 13, color: '#fff',
            cursor: 'pointer',
            border: '1px solid var(--border-strong)',
          }}
        >
          HS
        </div>
      </div>
    </header>
  );
}

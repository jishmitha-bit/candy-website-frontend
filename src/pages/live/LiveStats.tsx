export default function LiveStats({ counts }) {
  const stats = [
    { key: 'total',      label: 'Total contacts', val: counts.total,      sub: 'Imported from xlsx',    dotColor: 'var(--purple)' },
    { key: 'completed',  label: 'Completed',       val: counts.completed,  sub: `${Math.round(counts.completed / counts.total * 100)}% success rate`, dotColor: 'var(--green)', dotGlow: true },
    { key: 'inprogress', label: 'In progress',     val: counts.inprogress, sub: 'Active calls now',      dotColor: 'var(--blue)',  dotPulse: true },
    { key: 'declined',   label: 'Declined',        val: counts.declined,   sub: 'Not interested',        dotColor: 'var(--red)' },
    { key: 'pending',    label: 'Pending',         val: counts.pending,    sub: 'Retry queue',           dotColor: 'var(--amber)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
      {stats.map(s => (
        <div
          key={s.key}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 18,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-3)', marginBottom: 10,
              display: 'flex', alignItems: 'center',
            }}
          >
            <span
              className={s.dotPulse ? 'pulse-dot-sm' : s.dotGlow ? '' : ''}
              style={{
                display: 'inline-block',
                width: 8, height: 8, borderRadius: '50%',
                background: s.dotColor,
                boxShadow: s.dotGlow ? `0 0 8px ${s.dotColor}` : undefined,
                marginRight: 6,
              }}
            />
            {s.label}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            {s.val}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

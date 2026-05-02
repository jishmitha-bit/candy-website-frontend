import Icon from '../../assets/icons';
import { recentActivity } from '../../utils/mockData';

const dotStyles = {
  '':      { bg: 'rgba(117,91,227,0.15)', color: 'var(--purple-hi)' },
  blue:    { bg: 'rgba(24,218,252,0.15)',  color: 'var(--blue)' },
  green:   { bg: 'rgba(76,175,80,0.15)',   color: 'var(--green)' },
  amber:   { bg: 'rgba(255,181,71,0.15)',  color: 'var(--amber)' },
};

export default function ActivityPanel() {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>Recent activity</h3>
        <a href="#" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>View all</a>
      </div>

      {recentActivity.map((a, i) => {
        const ds = dotStyles[a.tint] ?? dotStyles[''];
        return (
          <div
            key={i}
            style={{
              display: 'flex', gap: 14, padding: '12px 0',
              borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'grid', placeItems: 'center',
                flexShrink: 0,
                background: ds.bg, color: ds.color,
              }}
            >
              <Icon name={a.icon} size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 13.5, lineHeight: 1.45, color: 'var(--text-1)' }}
                dangerouslySetInnerHTML={{ __html: a.text }}
              />
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 3 }}>{a.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

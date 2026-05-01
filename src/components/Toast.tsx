import { useApp } from '../context/AppContext';
import Icon from '../assets/icons';

export default function ToastHost() {
  const { toasts } = useApp();

  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className="toast-in"
          style={{
            background: 'rgba(22,22,32,0.95)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13,
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--shadow-deep)',
            minWidth: 280,
            color: 'var(--text-1)',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: 22, height: 22, borderRadius: '50%',
              display: 'grid', placeItems: 'center',
              background: 'rgba(76,175,80,0.15)', color: 'var(--green)',
              flexShrink: 0,
            }}
          >
            <Icon name="check" size={12} />
          </div>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

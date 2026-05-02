/**
 * AgentScaffold — shared placeholder shell for every industry-agent page.
 *
 * Each agent (E-commerce, Financial, Logistics, Healthcare, Marketing, etc.)
 * has its own folder under src/pages/ with an index.tsx that renders this
 * scaffold. Replace the scaffold call with real chat/workflow components as
 * each agent is built out.
 */
import Icon from '../assets/icons';
import { useApp } from '../context/AppContext';

const tintGlow = {
  purple: 'rgba(117,91,227,0.45)',
  blue:   'rgba(24,218,252,0.45)',
  teal:   'rgba(79,209,197,0.45)',
  green:  'rgba(76,175,80,0.45)',
  amber:  'rgba(255,181,71,0.45)',
  pink:   'rgba(230,90,255,0.45)',
};

const tintColor = {
  purple: 'var(--purple-hi)',
  blue:   'var(--blue)',
  teal:   'var(--teal)',
  green:  'var(--green)',
  amber:  'var(--amber)',
  pink:   'var(--pink)',
};

export default function AgentScaffold({ category, tagline, icon, tint = 'purple' }) {
  const { showView, addToast } = useApp();

  return (
    <div style={{ maxWidth: 920, margin: '40px auto 60px' }}>
      <p
        style={{
          fontSize: 11.5, letterSpacing: '0.18em',
          color: tintColor[tint], textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        Voice Agent · {category}
      </p>

      <div
        style={{
          position: 'relative',
          padding: '40px 36px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-strong)',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow tinted by category */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 600px 300px at 20% 0%, ${tintGlow[tint]}, transparent 65%)`,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--tint-2)',
              border: '1px solid var(--border-strong)',
              display: 'grid', placeItems: 'center',
              color: tintColor[tint],
              marginBottom: 22,
            }}
          >
            <Icon name={icon} size={26} />
          </div>

          <h1
            style={{
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em',
              color: 'var(--text-1)', marginBottom: 12,
            }}
          >
            {category} agent
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 600, lineHeight: 1.6 }}>
            {tagline}
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
            <button
              onClick={() => addToast(`${category} agent — coming soon`, 'info')}
              style={primaryBtn}
            >
              <Icon name="zap" size={14} /> Start building
            </button>
            <button
              onClick={() => showView('dashboard')}
              style={ghostBtn}
            >
              <Icon name="arrowRight" size={12} style={{ transform: 'rotate(180deg)' }} /> Back to dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Empty-state cards — placeholders for chat / workflow / analytics */}
      <div
        style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}
      >
        {[
          { icon: 'chat',  label: 'Conversation flow', sub: 'Define what the agent says.' },
          { icon: 'flow',  label: 'Workflow',          sub: 'Wire up integrations.' },
          { icon: 'chart', label: 'Analytics',         sub: 'Measure outcomes.' },
        ].map(slot => (
          <div
            key={slot.label}
            style={{
              padding: 20,
              borderRadius: 14,
              border: '1px dashed var(--border-strong)',
              background: 'var(--tint-1)',
            }}
          >
            <Icon name={slot.icon} size={18} style={{ color: tintColor[tint] }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginTop: 10 }}>
              {slot.label}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>
              {slot.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const primaryBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '10px 18px', borderRadius: 10,
  background: 'var(--grad-brand)', color: '#fff',
  border: 'none', fontSize: 13.5, fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.15s',
};

const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '10px 16px', borderRadius: 10,
  background: 'transparent',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-2)', fontSize: 13.5, fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.15s',
};

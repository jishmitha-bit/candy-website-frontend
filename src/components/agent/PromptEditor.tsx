/**
 * PromptEditor — system prompt textarea with preset shortcuts and char count.
 * Local state only — wire `onChange` up to your store when persisting.
 */
import { useState } from 'react';
import Icon from '../../assets/icons';

const tintColor = {
  purple: 'var(--purple-hi)', blue: 'var(--blue)', teal: 'var(--teal)',
  green: 'var(--green)', amber: 'var(--amber)', pink: 'var(--pink)',
};

export default function PromptEditor({
  defaultValue = '',
  presets = [],
  tint = 'purple',
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <section style={section}>
      <header style={sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="brain" size={16} style={{ color: tintColor[tint] }} />
          <h3 style={sectionTitle}>System prompt</h3>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
          {value.length.toLocaleString()} chars
        </span>
      </header>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={9}
        placeholder="You are a helpful voice agent…"
        style={textarea}
      />

      {presets.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setValue(p.body)}
              style={{
                fontSize: 11.5, padding: '6px 10px',
                borderRadius: 7,
                background: 'var(--tint-1)',
                border: '1px solid var(--border)',
                color: 'var(--text-2)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

const section = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: 22,
};
const sectionHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  marginBottom: 14,
};
const sectionTitle = { fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: 0 };
const textarea = {
  width: '100%',
  background: 'var(--input-bg-strong)',
  border: '1px solid var(--border-strong)',
  borderRadius: 10,
  padding: '14px 16px',
  fontSize: 13.5,
  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
  lineHeight: 1.55,
  color: 'var(--text-1)',
  outline: 'none',
  resize: 'vertical',
  minHeight: 180,
};

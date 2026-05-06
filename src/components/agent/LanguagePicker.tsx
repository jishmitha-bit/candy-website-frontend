/**
 * LanguagePicker — multi-select chip list of languages, plus a "primary"
 * dropdown that becomes the agent's default `language_code`.
 *
 * Loads /v1/languages on mount, shows a friendly fallback if it fails (e.g.
 * empty languages table).
 */
import { useEffect, useState } from 'react';
import Icon from '../../assets/icons';
import { listLanguages, type Language } from '../../api/languages';
import { ApiError } from '../../api/client';

const tintColor = {
  purple: 'var(--purple-hi)', blue: 'var(--blue)', teal: 'var(--teal)',
  green: 'var(--green)', amber: 'var(--amber)', pink: 'var(--pink)',
};

interface Props {
  tint?: keyof typeof tintColor;
  primary: string;
  onPrimaryChange: (code: string) => void;
  supported: string[];                        // language codes the agent supports
  onSupportedChange: (codes: string[]) => void;
  multilingual: boolean;
  onMultilingualChange: (v: boolean) => void;
}

export default function LanguagePicker({
  tint = 'purple',
  primary, onPrimaryChange,
  supported, onSupportedChange,
  multilingual, onMultilingualChange,
}: Props) {
  const [langs, setLangs] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listLanguages();
        if (!cancelled) setLangs(list);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof ApiError ? e.message : (e as Error).message;
        setErr(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function toggleSupported(code: string) {
    const set = new Set(supported);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    onSupportedChange(Array.from(set));
  }

  return (
    <section style={section}>
      <header style={sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="layers" size={16} style={{ color: tintColor[tint] }} />
          <h3 style={sectionTitle}>Languages</h3>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
          {loading ? 'Loading…' : `${supported.length} selected`}
        </span>
      </header>

      {err && (
        <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 10 }}>
          Couldn't load languages: {err}
        </div>
      )}

      {/* Primary language */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: 'var(--text-2)' }}>Primary</label>
        <select
          value={primary}
          onChange={e => onPrimaryChange(e.target.value)}
          disabled={loading || langs.length === 0}
          style={selectStyle}
        >
          {langs.length === 0 && <option value={primary}>{primary}</option>}
          {langs.map(l => (
            <option key={l.code} value={l.code}>
              {l.name} ({l.code})
            </option>
          ))}
        </select>

        <label
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--text-2)', marginLeft: 'auto',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={multilingual}
            onChange={e => onMultilingualChange(e.target.checked)}
            style={{ accentColor: 'var(--purple)' }}
          />
          Allow mid-call language switching
        </label>
      </div>

      {/* Supported languages */}
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>
        Supported (select all the languages this agent should handle):
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {loading && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Loading…</span>}
        {!loading && langs.length === 0 && !err && (
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>No languages configured.</span>
        )}
        {langs.map(l => {
          const on = supported.includes(l.code);
          return (
            <button
              key={l.code}
              onClick={() => toggleSupported(l.code)}
              style={{
                fontSize: 11.5, padding: '6px 10px', borderRadius: 7,
                background: on ? `${tintColor[tint]}1f` : 'var(--tint-1)',
                border: `1px solid ${on ? tintColor[tint] : 'var(--border)'}`,
                color: on ? 'var(--text-1)' : 'var(--text-2)',
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              {on && <Icon name="check" size={10} />}
              {l.name} <span style={{ opacity: 0.6 }}>({l.code})</span>
            </button>
          );
        })}
      </div>
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
const selectStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  background: 'var(--input-bg-strong)',
  border: '1px solid var(--border-strong)',
  color: 'var(--text-1)',
  fontSize: 13,
  outline: 'none',
  minWidth: 180,
};

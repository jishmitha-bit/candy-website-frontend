/**
 * PromptEditor — requirements textarea.
 * Wired to POST /v1/agents/{agent_id}/requirements (the backend uses the
 * `requirements_text` to compile the agent's system prompt).
 *
 * The text + language settings come from the parent page's useAgent() hook so
 * other components (Publish button, LanguagePicker) stay in sync.
 */
import { useState } from 'react';
import Icon from '../../assets/icons';
import { saveRequirements } from '../../api/requirements';
import { ApiError } from '../../api/client';
import { useApp } from '../../context/AppContext';

const tintColor = {
  purple: 'var(--purple-hi)', blue: 'var(--blue)', teal: 'var(--teal)',
  green: 'var(--green)', amber: 'var(--amber)', pink: 'var(--pink)',
};

interface Props {
  presets?: { label: string; body: string }[];
  tint?: keyof typeof tintColor;
  agentId: string | null;
  value: string;
  onChange: (s: string) => void;
  supportedLanguageCodes?: string[];
  multilingual?: boolean;
  onSaved?: () => void;
}

export default function PromptEditor({
  presets = [],
  tint = 'purple',
  agentId,
  value,
  onChange,
  supportedLanguageCodes = [],
  multilingual = false,
  onSaved,
}: Props) {
  const { addToast } = useApp();
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!agentId || busy) return;
    if (value.trim().length < 10) {
      addToast('Requirements are too short — at least 10 characters.', 'info');
      return;
    }
    setBusy(true);
    try {
      const res = await saveRequirements(agentId, {
        requirements_text: value,
        multilingual,
        supported_language_codes: supportedLanguageCodes,
      });
      // Backend now compiles inline (up to ~12s) and tells us the
      // outcome via prompt_compile + agent_flow_status. Reflect that
      // honestly so the user knows whether the next test will pick up
      // the new requirements.
      switch (res.prompt_compile) {
        case 'compiled':
          addToast('Requirements saved · agent ready to test', 'success');
          break;
        case 'compiling':
          addToast('Requirements saved · still compiling, give it a few seconds', 'info');
          break;
        case 'failed':
          addToast('Requirements saved but compile failed — check the backend log.', 'error');
          break;
        default:
          addToast('Requirements saved · compiling in background', 'success');
      }
      onSaved?.();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : (e as Error).message;
      addToast(`Save failed: ${msg}`, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={section}>
      <header style={sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="brain" size={16} style={{ color: tintColor[tint] }} />
          <h3 style={sectionTitle}>Requirements</h3>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
          {value.length.toLocaleString()} chars
        </span>
      </header>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={9}
        placeholder="Describe what this agent should do, tone, what it must never do…"
        style={textarea}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {presets.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => onChange(p.body)}
                style={presetBtn}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : <span />}

        <button
          onClick={save}
          disabled={!agentId || busy}
          style={{
            ...saveBtn,
            opacity: !agentId || busy ? 0.6 : 1,
            cursor: !agentId || busy ? 'wait' : 'pointer',
          }}
        >
          {busy ? 'Saving…' : 'Save requirements'}
        </button>
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
  resize: 'vertical' as const,
  minHeight: 180,
};
const presetBtn = {
  fontSize: 11.5, padding: '6px 10px',
  borderRadius: 7,
  background: 'var(--tint-1)',
  border: '1px solid var(--border)',
  color: 'var(--text-2)', cursor: 'pointer',
  transition: 'all 0.15s',
};
const saveBtn = {
  fontSize: 12.5, fontWeight: 600,
  padding: '8px 14px', borderRadius: 9,
  background: 'var(--grad-brand)',
  color: '#fff', border: 'none',
  boxShadow: '0 4px 12px -4px rgba(117,91,227,0.5)',
  transition: 'all 0.15s',
};

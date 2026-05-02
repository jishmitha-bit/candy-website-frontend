/**
 * TestPanel — interactive sandbox for testing the agent.
 *
 *   · Click the mic to toggle "listening" (visual state only — wire up to a
 *     real WebRTC/STT pipeline when you have one).
 *   · Or type a message in the composer to send a fake user turn; the agent
 *     replies with a deterministic stub so you can see the UI in motion.
 */
import { useState, useEffect, useRef } from 'react';
import Icon from '../../assets/icons';

const tintColor = {
  purple: 'var(--purple-hi)', blue: 'var(--blue)', teal: 'var(--teal)',
  green: 'var(--green)', amber: 'var(--amber)', pink: 'var(--pink)',
};
const tintHi = {
  purple: 'rgba(117,91,227,0.55)',
  blue:   'rgba(24,218,252,0.55)',
  teal:   'rgba(79,209,197,0.55)',
  green:  'rgba(76,175,80,0.55)',
  amber:  'rgba(255,181,71,0.55)',
  pink:   'rgba(230,90,255,0.55)',
};

export default function TestPanel({
  category = 'this',
  agentReply = 'Got it. (Stub reply — wire me up to your model.)',
  tint = 'purple',
}) {
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState('');
  const [transcript, setTranscript] = useState([
    { role: 'agent', text: `Hi — I'm your ${category} voice agent. Try a message or press the mic.` },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [transcript]);

  function send(text) {
    if (!text.trim()) return;
    setTranscript(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setTranscript(prev => [...prev, { role: 'agent', text: agentReply }]);
    }, 650);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <aside style={panel}>
      <header style={panelHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: listening ? 'var(--red)' : 'var(--green)',
              boxShadow: `0 0 10px ${listening ? 'var(--red)' : 'var(--green)'}`,
            }}
          />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>
            Test the agent
          </h3>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {listening ? 'Listening…' : 'Idle'}
        </span>
      </header>

      {/* Transcript */}
      <div ref={scrollRef} style={transcriptArea}>
        {transcript.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.role === 'user' ? 'var(--tint-2)' : tintHi[tint] + '33',
                border: `1px solid ${m.role === 'user' ? 'var(--border)' : tintHi[tint]}`,
                color: 'var(--text-1)',
                fontSize: 13.5,
                lineHeight: 1.5,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Mic */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px' }}>
        <button
          onClick={() => setListening(v => !v)}
          aria-label={listening ? 'Stop recording' : 'Start recording'}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: listening ? tintHi[tint] : 'var(--tint-2)',
            border: `2px solid ${tintHi[tint]}`,
            color: listening ? '#fff' : tintColor[tint],
            display: 'grid', placeItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.18s',
            boxShadow: listening ? `0 0 0 8px ${tintHi[tint]}33, 0 0 30px ${tintHi[tint]}` : 'none',
            animation: listening ? 'mic-pulse 1.6s ease-in-out infinite' : 'none',
          }}
        >
          <Icon name="mic" size={22} />
        </button>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-3)', marginBottom: 12 }}>
        {listening ? 'Click again to stop' : 'Click to talk, or type below'}
      </div>

      {/* Composer */}
      <div style={composer}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a question…"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-1)', fontSize: 13.5,
          }}
        />
        <button
          onClick={() => send(input)}
          aria-label="Send"
          disabled={!input.trim()}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: input.trim() ? tintHi[tint] : 'transparent',
            color: input.trim() ? '#fff' : 'var(--text-3)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'grid', placeItems: 'center',
            transition: 'all 0.15s',
          }}
        >
          <Icon name="send" size={14} />
        </button>
      </div>

      <style>{`
        @keyframes mic-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
      `}</style>
    </aside>
  );
}

const panel = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: 22,
  display: 'flex', flexDirection: 'column',
  height: 'fit-content',
  position: 'sticky',
  top: 92,
};
const panelHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  marginBottom: 14,
};
const transcriptArea = {
  flex: 1,
  display: 'flex', flexDirection: 'column', gap: 10,
  padding: 12,
  background: 'var(--tint-1)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  minHeight: 220,
  maxHeight: 320,
  overflowY: 'auto',
};
const composer = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 12px',
  background: 'var(--input-bg-strong)',
  border: '1px solid var(--border-strong)',
  borderRadius: 10,
};

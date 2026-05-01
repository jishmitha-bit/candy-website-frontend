import { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../../assets/icons';

export default function ChatPanel() {
  const { chatMessages, setChatMessages } = useApp();
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [chatMessages]);

  function sendChat() {
    const text = input.trim();
    if (!text) return;
    const now  = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setInput('');

    const userMsg = { role: 'user', text, time };
    const typing  = { role: 'typing' };
    setChatMessages(prev => [...prev, userMsg, typing]);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev.filter(m => m.role !== 'typing'),
        {
          role: 'ai',
          text: "Understood. I'll apply that to the active campaign and summarize results once the next batch completes. You can track progress in the panel on the right →",
          time,
        },
      ]);
    }, 1400);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Chat header */}
      <div
        style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'linear-gradient(180deg, rgba(117,91,227,0.08), transparent)',
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--grad-brand)',
            display: 'grid', placeItems: 'center',
            boxShadow: 'var(--shadow-glow-purple)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <Icon name="brain" size={18} style={{ color: 'white' }} />
          <span
            style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 12, height: 12, borderRadius: '50%',
              background: 'var(--green)',
              border: '2px solid var(--bg-1)',
              boxShadow: '0 0 8px var(--green)',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-1)' }}>Atlas · HR Assistant</h4>
          <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>Powered by Metaspace AI · Online</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { icon: 'settings', tip: 'Settings' },
            { icon: 'expand',   tip: 'Expand' },
          ].map(({ icon, tip }) => (
            <button
              key={icon}
              className="tooltip-wrap"
              data-tip={tip}
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-2)',
                display: 'grid', placeItems: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <Icon name={icon} size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={bodyRef}
        style={{
          flex: 1, overflowY: 'auto',
          padding: 22,
          display: 'flex', flexDirection: 'column', gap: 20,
          scrollBehavior: 'smooth',
          minHeight: 0,
        }}
      >
        {chatMessages.map((m, i) => <Message key={i} msg={m} />)}
      </div>

      {/* Composer */}
      <div
        style={{
          padding: '16px 20px 20px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        {/* Tool buttons */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[
            { icon: 'paperclip', label: 'Attach' },
            { icon: 'brain',     label: 'Templates' },
            { icon: 'zap',       label: 'Slash commands' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              style={{
                padding: '6px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-2)', cursor: 'pointer',
                fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 5,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              <Icon name={icon} size={12} /> {label}
            </button>
          ))}
        </div>

        {/* Input field */}
        <div
          style={{
            display: 'flex', alignItems: 'flex-end', gap: 10,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid var(--border-strong)',
            borderRadius: 14,
            padding: '12px 14px',
            transition: 'border-color 0.15s',
          }}
          onFocus={e  => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(117,91,227,0.12)'; }}
          onBlur={e   => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask or assign a task…"
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-1)', fontSize: 14, fontFamily: 'inherit',
              resize: 'none', maxHeight: 120, minHeight: 22, lineHeight: 1.4,
            }}
          />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className="tooltip-wrap" data-tip="Voice"
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'transparent', border: 'none',
                color: 'var(--text-3)', cursor: 'pointer',
                display: 'grid', placeItems: 'center',
                transition: 'color 0.15s',
              }}
            >
              <Icon name="mic" size={16} />
            </button>
            <button
              onClick={sendChat}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--grad-brand)', color: '#fff',
                border: 'none', cursor: 'pointer',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 6px 16px -4px rgba(117,91,227,0.5)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Icon name="send" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Message({ msg }) {
  if (msg.role === 'typing') {
    return (
      <div style={{ display: 'flex', gap: 12, maxWidth: '88%' }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            display: 'grid', placeItems: 'center',
            fontSize: 11, fontWeight: 700,
            background: 'var(--grad-brand)', color: '#fff',
          }}
        >
          AI
        </div>
        <div>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px',
              width: 'fit-content',
            }}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="typing-dot"
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--text-3)', display: 'block',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isUser = msg.role === 'user';
  return (
    <div
      style={{
        display: 'flex', gap: 12, maxWidth: '88%',
        marginLeft: isUser ? 'auto' : 0,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <div
        style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 700,
          background: isUser ? 'var(--grad-pink)' : 'var(--grad-brand)',
          color: '#fff',
        }}
      >
        {isUser ? 'HS' : 'AI'}
      </div>
      <div>
        <div
          style={{
            padding: '12px 16px',
            borderRadius: isUser ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
            fontSize: 14, lineHeight: 1.5,
            border: '1px solid var(--border)',
            background: isUser
              ? 'linear-gradient(135deg, rgba(117,91,227,0.2), rgba(24,218,252,0.15))'
              : 'rgba(255,255,255,0.03)',
            borderColor: isUser ? 'var(--border-accent)' : 'var(--border)',
            color: 'var(--text-1)',
          }}
        >
          {msg.text}
          {msg.file && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid var(--border-strong)',
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(76,175,80,0.15)', color: 'var(--green)',
                  display: 'grid', placeItems: 'center',
                }}
              >
                <Icon name="file" size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{msg.file.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{msg.file.size}</div>
              </div>
              <button
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-2)', cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                }}
              >
                <Icon name="more" size={12} />
              </button>
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 10.5, color: 'var(--text-4)', marginTop: 6,
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {msg.time}
        </div>
      </div>
    </div>
  );
}

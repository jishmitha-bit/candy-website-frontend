import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../../assets/icons';

export default function AuthPage() {
  const { showView } = useApp();
  const [email,    setEmail]    = useState('hello@spacemarvel.ai');
  const [password, setPassword] = useState('••••••••••');
  const [remember, setRemember] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    showView('dashboard');
  }

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        {/* Aura glow */}
        <div className="auth-aura" />

        {/* Card */}
        <div
          style={{
            position: 'relative', zIndex: 1,
            background: 'linear-gradient(180deg, rgba(22,22,32,0.9), rgba(15,15,23,0.9))',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: '44px 40px',
            backdropFilter: 'blur(30px)',
            boxShadow: 'var(--shadow-card), 0 0 60px rgba(117,91,227,0.15)',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div
              className="logo-mark-shine"
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--grad-brand)',
                display: 'grid', placeItems: 'center',
                boxShadow: 'var(--shadow-glow-purple)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <Icon name="layers" size={20} style={{ position: 'relative', zIndex: 1, color: 'white' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
              Meta<span className="grad-text">space</span>
            </div>
          </div>

          <div
            style={{
              fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase',
              letterSpacing: '0.18em', marginBottom: 10,
            }}
          >
            Welcome back
          </div>
          <h1
            style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, marginBottom: 8, color: 'var(--text-1)' }}
          >
            Sign in to your <span className="grad-text">workspace</span>
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 32 }}>
            Chat, automate, and deploy voice agents — all in one meta platform.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: 12, color: 'var(--text-2)', marginBottom: 8, letterSpacing: '0.02em' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%', background: 'var(--input-bg)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius)',
                  padding: '14px 16px', color: 'var(--text-1)',
                  fontSize: 14, outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--purple)'; e.target.style.boxShadow = '0 0 0 3px rgba(117,91,227,0.15)'; e.target.style.background = 'var(--input-bg-strong)'; }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--input-bg)'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label
                htmlFor="password"
                style={{ display: 'block', fontSize: 12, color: 'var(--text-2)', marginBottom: 8, letterSpacing: '0.02em' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%', background: 'var(--input-bg)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius)',
                  padding: '14px 16px', color: 'var(--text-1)',
                  fontSize: 14, outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--purple)'; e.target.style.boxShadow = '0 0 0 3px rgba(117,91,227,0.15)'; e.target.style.background = 'var(--input-bg-strong)'; }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--input-bg)'; }}
              />
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 24px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ accentColor: 'var(--purple)' }}
                />
                Keep me signed in
              </label>
              <a
                href="#"
                style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', borderBottom: '1px dashed transparent', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.target.style.color = 'var(--blue)'; e.target.style.borderBottomColor = 'var(--blue)'; }}
                onMouseLeave={e => { e.target.style.color = 'var(--text-2)'; e.target.style.borderBottomColor = 'transparent'; }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary-shimmer"
              style={{
                width: '100%',
                background: 'var(--grad-brand)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '14px 22px',
                fontSize: 14, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(117,91,227,0.6)',
                letterSpacing: '0.01em',
                transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 14px 35px -10px rgba(117,91,227,0.75)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(117,91,227,0.6)'; }}
              onMouseDown={e  => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Sign In
              <Icon name="arrowRight" size={14} />
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              margin: '24px 0', color: 'var(--text-4)', fontSize: 12,
            }}
          >
            <span style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
            OR CONTINUE WITH
            <span style={{ flex: 1, height: 1, background: 'var(--border-strong)' }} />
          </div>

          {/* OAuth */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              {
                label: 'Google',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.64 12.2c0-.82-.07-1.6-.21-2.36H12v4.47h6.54c-.28 1.52-1.14 2.8-2.43 3.67v3.05h3.93c2.3-2.12 3.6-5.23 3.6-8.83z" fill="#4285f4"/>
                    <path d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.93-3.05c-1.08.73-2.47 1.17-4.02 1.17-3.1 0-5.73-2.1-6.66-4.9H1.28v3.08C3.26 21.3 7.31 24 12 24z" fill="#34a853"/>
                    <path d="M5.34 14.32c-.24-.73-.38-1.5-.38-2.32s.13-1.6.38-2.32V6.6H1.28C.46 8.23 0 10.06 0 12s.47 3.77 1.28 5.4l4.06-3.08z" fill="#fbbc04"/>
                    <path d="M12 4.75c1.76 0 3.33.6 4.57 1.79l3.47-3.47C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4.06 3.08C6.27 6.85 8.9 4.75 12 4.75z" fill="#ea4335"/>
                  </svg>
                ),
              },
              {
                label: 'GitHub',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.8-.26.8-.58v-2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.8 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0C17.3 4.72 18.3 5.04 18.3 5.04c.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.8 1.1.8 2.22v3.3c0 .32.2.7.8.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                style={{
                  background: 'var(--tint-1)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-1)',
                  padding: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: 13,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'var(--tint-3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--tint-1)'; }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 26, color: 'var(--text-3)', fontSize: 13 }}>
            Don't have an account?{' '}
            <a href="#" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 500 }}>
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

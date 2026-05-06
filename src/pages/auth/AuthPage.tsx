import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../../assets/icons';
import { login, signup } from '../../api/auth';
import { ApiError } from '../../api/client';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const { signedIn, addToast } = useApp();
  const [mode, setMode]         = useState<Mode>('login');
  const [email,    setEmail]    = useState('hello@spacemarvel.ai');
  const [password, setPassword] = useState('');
  const [companyName, setCompany] = useState('SpaceMarvel');
  const [fullName,    setFullName] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy]         = useState(false);
  const [err, setErr]           = useState<string | null>(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErr(null);
    try {
      const result = mode === 'login'
        ? await login(email, password)
        : await signup({ company_name: companyName, email, password, full_name: fullName || undefined });
      addToast(`Welcome${result.user.full_name ? ', ' + result.user.full_name : ''}!`, 'success');
      signedIn(result.user);
    } catch (e: any) {
      const msg = e instanceof ApiError
        ? (typeof e.detail === 'string' ? e.detail : (e.detail?.detail ?? e.message))
        : (e?.message || 'Sign-in failed');
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        <div className="auth-aura" />

        <div
          style={{
            position: 'relative', zIndex: 1,
            background: 'var(--card-bg-strong)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: '44px 40px',
            backdropFilter: 'blur(30px)',
            boxShadow: 'var(--shadow-card), 0 0 60px rgba(117,91,227,0.15)',
          }}
        >
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
            {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
          </div>
          <h1
            style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, marginBottom: 8, color: 'var(--text-1)' }}
          >
            {mode === 'login'
              ? <>Sign in to your <span className="grad-text">workspace</span></>
              : <>Start your <span className="grad-text">free workspace</span></>}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 32 }}>
            Chat, automate, and deploy voice agents — all in one meta platform.
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <Field label="Company name">
                  <input
                    value={companyName}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    required
                    style={inputStyle}
                  />
                </Field>
                <Field label="Your name (optional)">
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    style={inputStyle}
                  />
                </Field>
              </>
            )}

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                style={inputStyle}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={8}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={inputStyle}
              />
            </Field>

            {mode === 'login' && (
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
                  onClick={e => { e.preventDefault(); addToast('Password reset is not wired up yet.', 'info'); }}
                  style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}
                >
                  Forgot password?
                </a>
              </div>
            )}

            {err && (
              <div
                role="alert"
                style={{
                  background: 'rgba(255,90,120,0.12)',
                  border: '1px solid rgba(255,90,120,0.4)',
                  color: '#ff8194',
                  padding: '10px 12px', borderRadius: 10,
                  fontSize: 13, marginBottom: 14,
                }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
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
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.7 : 1,
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(117,91,227,0.6)',
                letterSpacing: '0.01em',
                transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              }}
            >
              {busy ? 'Working…' : (mode === 'login' ? 'Sign In' : 'Create account')}
              {!busy && <Icon name="arrowRight" size={14} />}
            </button>
          </form>

          {/* Footer / mode toggle */}
          <div style={{ textAlign: 'center', marginTop: 26, color: 'var(--text-3)', fontSize: 13 }}>
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); setMode('signup'); setErr(null); }}
                  style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Start free trial
                </a>
              </>
            ) : (
              <>Already have an account?{' '}
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); setMode('login'); setErr(null); }}
                  style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'var(--input-bg)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius)',
  padding: '14px 16px', color: 'var(--text-1)',
  fontSize: 14, outline: 'none',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{ display: 'block', fontSize: 12, color: 'var(--text-2)', marginBottom: 8, letterSpacing: '0.02em' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

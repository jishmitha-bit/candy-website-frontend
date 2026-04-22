import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function AuthPage() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login()
      navigate('/app/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-[1]">
      <div className="w-full max-w-[460px] relative">
        {/* Aura blob */}
        <div
          className="auth-aura absolute opacity-70 pointer-events-none"
          style={{
            inset: -80,
            zIndex: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.45), transparent 50%), radial-gradient(circle at 70% 70%, rgba(34,211,238,0.25), transparent 55%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Card */}
        <div
          className="relative z-[1] rounded-xl border border-border-strong p-11"
          style={{
            background: 'linear-gradient(180deg, rgba(14,8,32,0.97), rgba(4,2,10,0.97))',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 1px 0 rgba(124,58,237,0.08) inset, 0 20px 40px -20px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.1)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-[10px] grid place-items-center shadow-glow-purple logo-mark-shine relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EDE9FE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="relative z-[1]">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-[20px] tracking-[-0.02em]">
              Meta<span className="grad-text">space</span>
            </span>
          </div>

          <p className="text-[11px] text-text-3 uppercase tracking-[0.18em] mb-2.5">Welcome back</p>
          <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.025em] mb-2">
            Sign in to your <em className="not-italic grad-text">workspace</em>
          </h1>
          <p className="text-text-3 text-[14px] mb-8">
            Chat, automate, and deploy voice agents — all in one meta platform.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-[18px]">
              <label className="block text-[12px] text-text-2 mb-2 tracking-[0.02em]">Email</label>
              <input
                type="email"
                defaultValue="hello@spacemarvel.ai"
                className="w-full rounded-[14px] border border-border-strong px-4 py-3.5 text-[14px] text-text-1 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] placeholder:text-text-4"
                style={{ background: 'rgba(0,0,0,0.35)' }}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-[12px] text-text-2 mb-2 tracking-[0.02em]">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  defaultValue="••••••••••"
                  className="w-full rounded-[14px] border border-border-strong px-4 py-3.5 pr-12 text-[14px] text-text-1 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] placeholder:text-text-4"
                  style={{ background: 'rgba(0,0,0,0.35)' }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 mb-6">
              <label className="flex items-center gap-2 text-[13px] text-text-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-purple" />
                Keep me signed in
              </label>
              <a href="#" className="text-[13px] text-text-2 hover:text-neon-blue transition-colors border-b border-dashed border-transparent hover:border-neon-blue">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-[14px] font-semibold tracking-[0.01em] disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6 text-text-4 text-[12px]">
            <span className="flex-1 h-px bg-border-strong" />
            OR CONTINUE WITH
            <span className="flex-1 h-px bg-border-strong" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-2.5">
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
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-[14px] border border-border-strong text-text-1 text-[13px] transition-all hover:border-border-accent hover:bg-white/[0.04]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                {o.icon}
                {o.label}
              </button>
            ))}
          </div>

          <p className="text-center mt-6 text-text-3 text-[13px]">
            Don't have an account?{' '}
            <a href="#" className="text-neon-teal font-medium hover:underline">Start free trial</a>
          </p>
        </div>
      </div>
    </div>
  )
}

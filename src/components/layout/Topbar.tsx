import { useLocation } from 'react-router-dom'
import { Search, Zap, Bell, HelpCircle } from 'lucide-react'

const crumbMap: Record<string, { label: string; parent?: string }> = {
  '/app/dashboard': { label: 'Dashboard', parent: 'Home' },
  '/app/voice-agents': { label: 'AI Agent Chat', parent: 'Voice Agents' },
  '/app/live': { label: 'Live Campaign', parent: 'Voice Agents' },
  '/app/analytics': { label: 'Overview', parent: 'Analytics' },
  '/app/settings': { label: 'Settings', parent: 'Home' },
  '/app/data': { label: 'Data', parent: 'Home' },
}

export default function Topbar() {
  const location = useLocation()
  const crumb = crumbMap[location.pathname] ?? { label: 'Dashboard', parent: 'Home' }

  return (
    <header
      className="h-16 px-7 flex items-center gap-4 border-b border-border sticky top-0 z-10"
      style={{ background: 'rgba(4,2,10,0.8)', backdropFilter: 'blur(20px)' }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2.5 text-[13px] text-text-3 shrink-0">
        <span>Home</span>
        {crumb.parent && crumb.parent !== 'Home' && (
          <>
            <span className="text-text-4">/</span>
            <span>{crumb.parent}</span>
          </>
        )}
        <span className="text-text-4">/</span>
        <span className="text-text-1 font-medium">{crumb.label}</span>
      </nav>

      {/* Search */}
      <div
        className="flex-1 max-w-[520px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border border-border-strong transition-all focus-within:border-purple/40 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <Search className="w-3.5 h-3.5 text-text-3 shrink-0" />
        <input
          className="flex-1 bg-transparent border-none outline-none text-text-1 text-[14px] placeholder:text-text-3"
          placeholder="Search or ask AI…"
        />
        <span className="font-mono text-[10px] px-1.5 py-0.5 border border-border-strong rounded-[5px] text-text-3 bg-white/[0.03]">
          ⌘ K
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="tooltip-wrap w-[38px] h-[38px] grid place-items-center rounded-[10px] border border-border text-text-2 hover:text-text-1 hover:border-border-strong hover:bg-white/[0.04] transition-all" data-tip="What's new">
          <Zap className="w-4 h-4" />
        </button>
        <button className="tooltip-wrap relative w-[38px] h-[38px] grid place-items-center rounded-[10px] border border-border text-text-2 hover:text-text-1 hover:border-border-strong hover:bg-white/[0.04] transition-all" data-tip="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-[9px] right-[10px] w-[7px] h-[7px] rounded-full bg-neon-teal" />
        </button>
        <button className="tooltip-wrap w-[38px] h-[38px] grid place-items-center rounded-[10px] border border-border text-text-2 hover:text-text-1 hover:border-border-strong hover:bg-white/[0.04] transition-all" data-tip="Help">
          <HelpCircle className="w-4 h-4" />
        </button>
        <div
          className="tooltip-wrap w-[38px] h-[38px] rounded-[10px] grid place-items-center font-bold text-[13px] cursor-pointer border border-border-strong"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)', color: '#EDE9FE' }}
          data-tip="Hello (hello@spacemarvel.ai)"
        >
          HS
        </div>
      </div>
    </header>
  )
}

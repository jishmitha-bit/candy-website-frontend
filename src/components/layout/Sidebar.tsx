import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutGrid, MessageSquare, Mic, BarChart2, Settings, Plus, ArrowRight, Database,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { NavBadge } from '../ui/Badge'

const navSections = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/app/dashboard' },
      { id: 'voice-agents', label: 'AI Agent Chat', icon: MessageSquare, path: '/app/voice-agents', badge: 'NEW' },
      { id: 'live', label: 'Live Calls', icon: Mic, path: '/app/live' },
      { id: 'analytics', label: 'Analytics', icon: BarChart2, path: '/app/analytics' },
      { id: 'data', label: 'Data', icon: Database, path: '/app/data' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings, path: '/app/settings' },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const addToast = useAppStore((s) => s.addToast)

  const activeId = navSections.flatMap((s) => s.items).find((i) => location.pathname.startsWith(i.path))?.id

  return (
    <aside
      className="flex flex-col gap-2 p-3.5 sticky top-0 h-screen border-r border-border"
      style={{ background: 'linear-gradient(180deg, #0E0820 0%, #04020A 100%)', width: 248 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 pb-4 border-b border-border mb-2">
        <div className="flex items-center gap-2.5 cursor-pointer p-1 rounded-lg hover:bg-white/[0.03] transition-colors flex-1">
          <div
            className="w-8 h-8 rounded-[8px] grid place-items-center font-bold text-[14px] flex-shrink-0 shadow-glow-purple logo-mark-shine relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)', color: '#EDE9FE' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EDE9FE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-text-1">SpaceMarvel</span>
            <span className="text-[11px] text-text-3">Pro · Team</span>
          </div>
        </div>
        <button
          className="tooltip-wrap w-[30px] h-[30px] rounded-[8px] grid place-items-center border border-border text-text-2 hover:text-text-1 hover:border-border-strong hover:bg-white/[0.04] transition-all"
          data-tip="New workspace"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Nav */}
      {navSections.map((section) => (
        <div key={section.label}>
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-text-4 px-3 py-2 mt-1">
            {section.label}
          </div>
          {section.items.map((item) => {
            const Icon = item.icon
            const isActive = activeId === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`nav-active-bar w-full flex items-center gap-[11px] px-3 py-[10px] rounded-[10px] text-[14px] font-medium transition-all relative mb-0.5 ${
                  isActive
                    ? 'text-text-1 border border-purple/25'
                    : 'text-text-2 hover:text-text-1 hover:bg-white/[0.035] border border-transparent'
                }`}
                style={isActive ? { background: 'linear-gradient(90deg, rgba(124,58,237,0.18), rgba(124,58,237,0.04))' } : {}}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
              </button>
            )
          })}
        </div>
      ))}

      {/* Footer upgrade card */}
      <div
        className="mt-auto p-3 rounded-[14px] border border-border-strong relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, rgba(124,58,237,0.1), rgba(34,211,238,0.05))' }}
      >
        <div
          className="absolute w-20 h-20 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)', top: -30, right: -20 }}
        />
        <div className="text-[13px] font-semibold relative">Upgrade to Enterprise</div>
        <div className="text-[11.5px] text-text-3 my-1 relative">Unlimited agents, HIPAA, dedicated support.</div>
        <button
          onClick={() => addToast('Contacting sales team…', 'info')}
          className="relative text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border border-border-strong text-text-1 hover:bg-white/[0.1] transition-colors inline-flex items-center gap-1.5"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          Contact sales <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </aside>
  )
}

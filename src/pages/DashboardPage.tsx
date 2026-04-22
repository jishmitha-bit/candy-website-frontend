import { useNavigate } from 'react-router-dom'
import {
  Phone, CheckCircle, Workflow, Zap, ArrowRight, Plus,
  Upload, Mic, MessageSquare, BarChart2,
  Phone as PhoneIcon, Headphones, Users, CalendarDays, Target, ClipboardList,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { voiceAgents } from '../data/mockData'
import type { AgentTint, VoiceAgent } from '../types'

const tintGradients: Record<AgentTint, string> = {
  purple: 'radial-gradient(circle, rgba(124,58,237,0.45), transparent 70%)',
  blue: 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)',
  teal: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)',
  green: 'radial-gradient(circle, rgba(167,139,250,0.35), transparent 70%)',
  amber: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)',
  pink: 'radial-gradient(circle, rgba(192,132,252,0.4), transparent 70%)',
}

const tintColors: Record<AgentTint, string> = {
  purple: '#7C3AED',
  blue: '#22D3EE',
  teal: '#A78BFA',
  green: '#A78BFA',
  amber: '#F59E0B',
  pink: '#C084FC',
}

const iconMap: Record<string, LucideIcon> = {
  Phone: PhoneIcon,
  Headphones,
  Users,
  CalendarDays,
  Target,
  ClipboardList,
}

const stats = [
  { icon: Phone, label: 'Calls this week', value: '14,829', delta: '↑ 12.4%', up: true },
  { icon: CheckCircle, label: 'Success rate', value: '87.2%', delta: '↑ 3.1%', up: true },
  { icon: Workflow, label: 'Active workflows', value: '24', delta: '↑ 4', up: true },
  { icon: Zap, label: 'Tasks automated', value: '3,421', delta: '↓ 2.0%', up: false },
]

const suggestions = [
  { emoji: '🧑‍💻', label: 'Screen candidates', prompt: 'Screen candidates for a Senior Frontend role' },
  { emoji: '💸', label: 'Collect payments', prompt: 'Send payment reminders to overdue customers' },
  { emoji: '🏥', label: 'Book appointments', prompt: 'Book follow-up appointments for clinic' },
  { emoji: '📦', label: 'Confirm deliveries', prompt: 'Confirm deliveries for today\'s route' },
]

const activity = [
  { icon: Mic, tint: 'purple', text: <><strong>Voice campaign</strong> "Q2 Candidate Screening" completed with 142 contacts reached.</>, time: '2 minutes ago' },
  { icon: MessageSquare, tint: 'blue', text: <><strong>AI Chat</strong> generated a follow-up email template for declined candidates.</>, time: '18 minutes ago' },
  { icon: BarChart2, tint: 'green', text: <><strong>Weekly report</strong> is ready — success rate up 3.1% vs last week.</>, time: '1 hour ago' },
  { icon: Upload, tint: 'amber', text: <><strong>Data import</strong> — candidates_q2.xlsx (248 rows) processed.</>, time: '3 hours ago' },
]

const quickActions = [
  { icon: Upload, title: 'Upload contact list', sub: 'Excel, CSV, or Google Sheets', key: 'U' },
  { icon: Mic, title: 'Start voice campaign', sub: 'Launch calls in minutes', key: 'V' },
  { icon: MessageSquare, title: 'New AI conversation', sub: 'Ask, draft, or automate', key: 'N' },
  { icon: BarChart2, title: 'View analytics', sub: 'Performance & insights', key: 'A' },
]

const actTintBg: Record<string, string> = {
  purple: 'rgba(124,58,237,0.14)',
  blue: 'rgba(34,211,238,0.12)',
  green: 'rgba(167,139,250,0.12)',
  amber: 'rgba(245,158,11,0.12)',
}
const actTintColor: Record<string, string> = {
  purple: '#7C3AED',
  blue: '#22D3EE',
  green: '#A78BFA',
  amber: '#F59E0B',
}

function AgentCard({ agent }: { agent: VoiceAgent }) {
  const navigate = useNavigate()
  const addToast = useAppStore((s) => s.addToast)
  const Icon = iconMap[agent.iconName]

  const handleClick = () => {
    if (agent.id === 'hr') {
      navigate('/app/voice-agents')
    } else {
      addToast(`${agent.title} agent — opening soon`, 'info')
    }
  }

  return (
    <div
      onClick={handleClick}
      className="stagger-card cat-card-glow animate-fadeUp relative rounded-lg border border-border cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-border-accent p-6"
      style={{
        background: 'linear-gradient(180deg, rgba(14,8,32,0.8), rgba(4,2,10,0.65))',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="absolute w-[180px] h-[180px] rounded-full -top-16 -right-16 opacity-40 pointer-events-none transition-all duration-300"
        style={{ background: tintGradients[agent.tint], filter: 'blur(40px)' }}
      />

      <div
        className="relative w-12 h-12 rounded-[12px] grid place-items-center border border-border-strong mb-4"
        style={{ background: 'rgba(124,58,237,0.08)', color: tintColors[agent.tint] }}
      >
        {Icon && <Icon className="w-[22px] h-[22px]" strokeWidth={1.6} />}
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{agent.title}</h3>
        {agent.featured && (
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-border-accent text-purple-hi font-semibold" style={{ background: 'rgba(124,58,237,0.14)' }}>
            ⚡ Featured
          </span>
        )}
      </div>
      <p className="text-[13.5px] text-text-3 leading-relaxed mb-4 min-h-[42px]">{agent.desc}</p>

      <div className="flex items-center justify-between pt-3.5 border-t border-border">
        <div className="flex gap-3 text-[11.5px] text-text-3">
          <span><strong className="text-text-1 font-semibold">{agent.campaigns}</strong> campaigns</span>
          <span><strong className="text-text-1 font-semibold">{agent.agents}</strong> agents</span>
        </div>
        <span className="text-[12.5px] font-semibold text-text-1 flex items-center gap-1.5 transition-all">
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const addToast = useAppStore((s) => s.addToast)
  const navigate = useNavigate()
  const [promptVal, setPromptVal] = useState('')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <p className="text-[11px] text-text-3 uppercase tracking-[0.2em] mb-2.5">Good morning, Hello</p>
        <h1 className="text-[36px] font-bold tracking-[-0.025em] leading-[1.1] mb-3">
          Your <em className="not-italic grad-text">meta workspace</em> is ready.
        </h1>
        <p className="text-text-3 text-[15px] max-w-[560px]">
          Chat with AI, build automations, and deploy voice agents across any use case — from a single command center.
        </p>
      </div>

      {/* Hero prompt */}
      <div
        className="relative rounded-xl border border-border-strong p-7 mb-10 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(14,8,32,0.85), rgba(4,2,10,0.65))' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 500px 200px at 15% 20%, rgba(124,58,237,0.14), transparent 60%), radial-gradient(ellipse 400px 200px at 85% 80%, rgba(34,211,238,0.08), transparent 60%)',
          }}
        />
        <div className="relative z-[1]">
          <h3 className="text-[20px] font-semibold mb-1.5 flex items-center gap-2.5">
            <span className="live-dot w-2 h-2 rounded-full bg-neon-green inline-block" />
            Ask Metaspace AI
          </h3>
          <p className="text-text-3 text-[13.5px] mb-5">Describe a workflow, upload a list, or launch a campaign — one prompt away.</p>
          <div
            className="flex items-center gap-2.5 rounded-[14px] border border-border-strong px-4 py-3.5 transition-all focus-within:border-purple focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div className="w-7 h-7 rounded-[8px] grid place-items-center shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <input
              value={promptVal}
              onChange={(e) => setPromptVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && promptVal.trim()) navigate('/app/voice-agents') }}
              className="flex-1 bg-transparent border-none outline-none text-text-1 text-[14.5px] placeholder:text-text-3"
              placeholder="e.g. 'Call 200 candidates and screen for React experience'"
            />
            <button
              onClick={() => promptVal.trim() && navigate('/app/voice-agents')}
              className="w-9 h-9 rounded-[10px] grid place-items-center border border-border-strong text-text-1 hover:border-border-accent transition-all"
              style={{ background: 'rgba(124,58,237,0.1)' }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => setPromptVal(s.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-strong text-text-2 text-[12.5px] transition-all hover:bg-purple/10 hover:border-purple hover:text-text-1"
                style={{ background: 'rgba(124,58,237,0.05)' }}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4 mb-9">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="relative rounded-[14px] border border-border px-5 py-[18px] overflow-hidden"
              style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(12px)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.15), transparent)' }} />
              <div className="text-[12px] text-text-3 mb-2 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                {s.label}
              </div>
              <div className="text-[26px] font-bold tracking-[-0.02em] flex items-baseline gap-2">
                {s.value}
                <span className={`text-[12px] font-semibold ${s.up ? 'text-neon-green' : 'text-neon-red'}`}>{s.delta}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Voice agents section */}
      <div className="flex items-end justify-between mb-[18px]">
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Voice agents</h2>
          <p className="text-[13px] text-text-3 mt-0.5">Pick an agent type to launch a pre-built campaign.</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'favorites'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-[8px] border text-[12.5px] transition-all inline-flex items-center gap-1.5 ${
                filter === f ? 'text-text-1 border-purple/40' : 'text-text-2 border-border-strong hover:bg-white/[0.06] hover:text-text-1'
              }`}
              style={filter === f ? { background: 'rgba(124,58,237,0.14)' } : { background: 'rgba(124,58,237,0.03)' }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button
            onClick={() => addToast('Create new voice agent — coming soon', 'info')}
            className="px-3 py-1.5 rounded-[8px] border border-border-strong text-text-2 text-[12.5px] hover:bg-white/[0.06] hover:text-text-1 transition-all inline-flex items-center gap-1.5"
            style={{ background: 'rgba(124,58,237,0.03)' }}
          >
            <Plus className="w-3 h-3" /> New agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[18px] mb-10">
        {voiceAgents.map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>

      {/* Bottom row */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <div className="flex justify-between items-center mb-[18px]">
            <h3 className="text-[16px] font-semibold">Recent activity</h3>
            <a href="#" className="text-[12px] text-neon-teal hover:underline">View all</a>
          </div>
          {activity.map((a, i) => {
            const Icon = a.icon
            return (
              <div key={i} className={`flex gap-3.5 py-3 ${i < activity.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-8 h-8 rounded-full grid place-items-center shrink-0" style={{ background: actTintBg[a.tint], color: actTintColor[a.tint] }}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px] leading-[1.45]">{a.text}</p>
                  <p className="text-[11.5px] text-text-3 mt-0.5">{a.time}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <div className="flex justify-between items-center mb-[18px]">
            <h3 className="text-[16px] font-semibold">Quick actions</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {quickActions.map((q) => {
              const Icon = q.icon
              return (
                <button
                  key={q.key}
                  onClick={() => {
                    if (q.key === 'N') navigate('/app/voice-agents')
                    else if (q.key === 'A') navigate('/app/analytics')
                    else if (q.key === 'V') navigate('/app/live')
                    else addToast(`${q.title} — coming soon`, 'info')
                  }}
                  className="flex items-center gap-3 p-3 rounded-[10px] border border-border text-left cursor-pointer transition-all hover:bg-white/[0.04] hover:border-border-strong"
                  style={{ background: 'rgba(124,58,237,0.03)' }}
                >
                  <div className="w-[34px] h-[34px] rounded-[8px] grid place-items-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(34,211,238,0.1) 100%)' }}>
                    <Icon className="w-4 h-4 text-purple-hi" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium">{q.title}</div>
                    <div className="text-[11.5px] text-text-3 mt-0.5">{q.sub}</div>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 border border-border-strong rounded-[4px] text-text-3">⌘ {q.key}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

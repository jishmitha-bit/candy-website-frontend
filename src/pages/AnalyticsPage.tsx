import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Phone, CheckCircle, Clock, Users } from 'lucide-react'
import { weeklyCallData, callStatusData, agentUsageData } from '../data/mockData'

const kpis = [
  { icon: Phone, label: 'Total calls', value: '14,829', delta: '↑ 12.4%', up: true, color: '#7C3AED' },
  { icon: CheckCircle, label: 'Success rate', value: '87.2%', delta: '↑ 3.1%', up: true, color: '#A78BFA' },
  { icon: Clock, label: 'Avg duration', value: '3m 42s', delta: '↓ 0.3%', up: false, color: '#22D3EE' },
  { icon: Users, label: 'Contacts reached', value: '12,450', delta: '↑ 8.7%', up: true, color: '#C084FC' },
]

const tooltipStyle = {
  backgroundColor: 'rgba(14,8,32,0.98)',
  border: '1px solid rgba(124,58,237,0.2)',
  borderRadius: 10,
  color: '#EDE9FE',
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="px-3 py-2.5 rounded-[10px] border border-border-strong text-[12px]" style={{ background: 'rgba(14,8,32,0.98)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
      <p className="text-text-3 mb-1 text-[11px] font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  )
}

const totalStatus = callStatusData.reduce((s, i) => s + i.value, 0)

export default function AnalyticsPage() {
  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <p className="text-[11px] text-text-3 uppercase tracking-[0.2em] mb-2.5">Analytics · Overview</p>
        <h1 className="text-[36px] font-bold tracking-[-0.025em] leading-[1.1] mb-3">
          Performance <em className="not-italic grad-text">insights</em>
        </h1>
        <p className="text-text-3 text-[15px]">Track call performance, agent efficiency, and campaign outcomes in real time.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className="relative rounded-[14px] border border-border px-5 py-[18px] overflow-hidden" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(12px)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 100% 0%, ${k.color}18, transparent 60%)` }} />
              <div className="flex items-center gap-2 text-[12px] text-text-3 mb-2">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: k.color }} />
                {k.label}
              </div>
              <div className="text-[26px] font-bold tracking-[-0.02em] flex items-baseline gap-2">
                {k.value}
                <span className={`text-[12px] font-semibold ${k.up ? 'text-neon-green' : 'text-neon-red'}`}>{k.delta}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[16px] font-semibold">Calls over time</h3>
              <p className="text-[12px] text-text-3 mt-0.5">Total vs. successful this week</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neon-green">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyCallData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" />
              <XAxis dataKey="day" tick={{ fill: '#8B5CF6', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B5CF6', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="calls" name="Total calls" stroke="#7C3AED" strokeWidth={2} fill="url(#gradCalls)" />
              <Area type="monotone" dataKey="success" name="Successful" stroke="#22D3EE" strokeWidth={2} fill="url(#gradSuccess)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <h3 className="text-[16px] font-semibold mb-1">Call outcomes</h3>
          <p className="text-[12px] text-text-3 mb-4">Status breakdown — all campaigns</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={callStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {callStatusData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v.toLocaleString(), '']} contentStyle={tooltipStyle} itemStyle={{ color: '#A78BFA' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {callStatusData.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-text-2">{s.label}</span>
                </div>
                <div className="flex items-center gap-2 text-text-3">
                  <span className="font-mono">{s.value.toLocaleString()}</span>
                  <span className="text-[11px]">{Math.round(s.value / totalStatus * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <h3 className="text-[16px] font-semibold mb-1">Agent type usage</h3>
          <p className="text-[12px] text-text-3 mb-5">Calls by voice agent category</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agentUsageData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }} barSize={20}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" horizontal vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#8B5CF6', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B5CF6', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Calls" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <h3 className="text-[16px] font-semibold mb-1">Usage limits</h3>
          <p className="text-[12px] text-text-3 mb-5">Resets on May 1 · Pro plan</p>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Voice credits', used: 62840, total: 100000, color: '#7C3AED', sub: '37,160 credits remaining' },
              { label: 'Concurrent calls', used: 38, total: 50, color: '#22D3EE', sub: 'Peak: 50 today at 2:14 PM', warn: true },
              { label: 'AI chat tokens', used: 1.2, total: 2, color: '#A78BFA', sub: '800K tokens remaining', unit: 'M' },
              { label: 'Active agents', used: 8, total: 15, color: '#F59E0B', sub: '7 agent slots available' },
            ].map((u) => (
              <div key={u.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13.5px] font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: u.color }} />{u.label}
                  </span>
                  <span className="font-mono text-[12.5px]">
                    <span className="text-text-1 font-semibold">{u.used}{u.unit ?? ''}</span>
                    <span className="text-text-3"> / {u.total}{u.unit ?? ''}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden relative usage-shimmer" style={{ background: 'rgba(124,58,237,0.1)' }}>
                  <div className="h-full rounded-full relative" style={{ width: `${(u.used / u.total) * 100}%`, background: `linear-gradient(90deg, ${u.color}, ${u.color}cc)` }} />
                </div>
                <div className={`text-[11.5px] mt-1.5 ${u.warn ? 'text-neon-amber' : 'text-text-3'}`}>{u.warn ? '⚠ ' : ''}{u.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

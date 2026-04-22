import { useEffect, useRef } from 'react'
import { Filter, RefreshCw, Download, Pause, MoreHorizontal, Play, FileText } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { generateCalls, generateCall, statusPool } from '../data/mockData'
import { StatusBadge } from '../components/ui/Badge'
import type { Call, CallStatus } from '../types'

const liveStatColors: Record<string, string> = {
  total: '#7C3AED',
  completed: '#A78BFA',
  inprogress: '#22D3EE',
  declined: '#FF4560',
  pending: '#F59E0B',
}

function rand(n: number) { return Math.floor(Math.random() * n) }
function pick<T>(arr: T[]): T { return arr[rand(arr.length)] }

export default function LiveCallsPage() {
  const calls = useAppStore((s) => s.calls)
  const setCalls = useAppStore((s) => s.setCalls)
  const updateCall = useAppStore((s) => s.updateCall)
  const prependCall = useAppStore((s) => s.prependCall)
  const addToast = useAppStore((s) => s.addToast)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setCalls(generateCalls(14)) }, [setCalls])

  useEffect(() => {
    tickRef.current = setInterval(() => {
      const currentCalls = useAppStore.getState().calls
      const action = Math.random()
      if (action < 0.6) {
        const inProg = currentCalls.filter((c) => c.status === 'inprogress')
        if (inProg.length > 0) {
          const c = pick(inProg)
          const newStatusKey = pick(['completed', 'noanswer', 'rescheduled', 'followup'] as CallStatus[])
          const statusDef = statusPool.find((s) => s.key === newStatusKey)!
          updateCall(c.id, { status: newStatusKey, statusTxt: statusDef.txt, outcome: pick(statusDef.outcomes), duration: `${rand(8) + 1}m ${rand(59)}s` })
        } else {
          const others = currentCalls.filter((c) => c.status !== 'inprogress')
          if (others.length > 0) {
            const c = pick(others)
            const progDef = statusPool.find((s) => s.key === 'inprogress')!
            updateCall(c.id, { status: 'inprogress', statusTxt: 'In Progress', outcome: pick(progDef.outcomes), duration: 'live' })
          }
        }
      } else {
        prependCall(generateCall(Date.now()))
      }
    }, 2500)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [updateCall, prependCall])

  const counts = {
    total: calls.length + 95,
    completed: calls.filter((c) => c.status === 'completed').length + 52,
    inprogress: calls.filter((c) => c.status === 'inprogress').length + 3,
    declined: calls.filter((c) => c.status === 'declined').length + 18,
    pending: calls.filter((c) => c.status === 'noanswer' || c.status === 'rescheduled').length + 22,
  }

  const liveStats = [
    { key: 'total', label: 'Total contacts', val: counts.total, sub: 'Imported from xlsx' },
    { key: 'completed', label: 'Completed', val: counts.completed, sub: `${Math.round(counts.completed / counts.total * 100)}% success rate` },
    { key: 'inprogress', label: 'In progress', val: counts.inprogress, sub: 'Active calls now' },
    { key: 'declined', label: 'Declined', val: counts.declined, sub: 'Not interested' },
    { key: 'pending', label: 'Pending', val: counts.pending, sub: 'Retry queue' },
  ]

  return (
    <div className="animate-fadeUp">
      <div className="mb-5">
        <p className="text-[11px] text-neon-teal uppercase tracking-[0.2em] mb-2">Voice Campaign · Live</p>
        <h1 className="text-[28px] font-bold tracking-[-0.025em]">Senior Frontend Screening</h1>
        <p className="text-text-3 text-[15px] mt-1">248 candidates · Started 42 min ago · Est. 18 min remaining</p>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center mb-6">
        {(['All', 'Completed', 'In Progress', 'Declined', 'Pending'] as const).map((f, i) => (
          <button
            key={f}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12.5px] transition-all ${i === 0 ? 'border-border-strong text-text-1' : 'border-border text-text-2 hover:text-text-1'}`}
            style={{ background: i === 0 ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.03)' }}
          >
            {f}
            <span className="text-[10.5px] px-1.5 py-0.5 rounded-full" style={{ background: i === 0 ? '#7C3AED' : 'rgba(124,58,237,0.12)', color: i === 0 ? '#EDE9FE' : '#8B5CF6' }}>
              {[counts.total, counts.completed, counts.inprogress, counts.declined, counts.pending][i]}
            </span>
          </button>
        ))}
        <div className="flex-1" />
        {[{ icon: Filter, label: 'Filter' }, { icon: RefreshCw, label: 'Refresh' }, { icon: Download, label: 'Export CSV' }].map((b) => {
          const Icon = b.icon
          return (
            <button key={b.label} onClick={() => addToast(`${b.label} — coming soon`, 'info')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-text-2 text-[12.5px] hover:text-text-1 transition-all" style={{ background: 'rgba(124,58,237,0.03)' }}>
              <Icon className="w-3 h-3" /> {b.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-5 gap-3.5 mb-6">
        {liveStats.map((s) => (
          <div key={s.key} className="relative rounded-[14px] border border-border px-[18px] py-[18px] overflow-hidden" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(12px)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 100% 0%, ${liveStatColors[s.key]}18, transparent 60%)` }} />
            <div className="text-[11.5px] text-text-3 mb-1.5 font-medium">{s.label}</div>
            <div className="text-[26px] font-bold tracking-[-0.02em]" style={{ color: liveStatColors[s.key] }}>{s.val}</div>
            <div className="text-[11px] text-text-4 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-hidden" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="text-[16px] font-semibold flex items-center gap-2.5">
            Live call log
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-widest" style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE' }}>LIVE</span>
          </h3>
          <div className="flex gap-2">
            <button onClick={() => addToast('Campaign paused', 'info')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-border-strong text-text-2 text-[12.5px] hover:bg-white/[0.06] hover:text-text-1 transition-all" style={{ background: 'rgba(124,58,237,0.03)' }}>
              <Pause className="w-3 h-3" /> Pause campaign
            </button>
            <button className="px-2 py-1.5 rounded-[8px] border border-border text-text-2 hover:text-text-1 transition-all" style={{ background: 'rgba(124,58,237,0.03)' }}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border" style={{ background: 'rgba(124,58,237,0.03)' }}>
                {['Candidate', 'Phone', 'Status', 'Outcome', 'Duration', ''].map((h, i) => (
                  <th key={i} className={`px-5 py-3 text-[12px] text-text-3 font-medium ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => <CallRow key={call.id} call={call} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CallRow({ call }: { call: Call }) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-white/[0.02]" style={{ animationName: 'none' }}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full grid place-items-center text-[11.5px] font-bold shrink-0" style={{ background: call.avatarColor, color: '#EDE9FE' }}>{call.initials}</div>
          <div>
            <div className="text-[13.5px] font-medium">{call.name}</div>
            <div className="text-[11.5px] text-text-3 mt-0.5">{call.role}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 font-mono text-[12.5px] text-text-2">{call.phone}</td>
      <td className="px-5 py-3.5"><StatusBadge status={call.status} label={call.statusTxt} /></td>
      <td className="px-5 py-3.5 text-[13px] text-text-2 max-w-[180px]">{call.outcome}</td>
      <td className="px-5 py-3.5">
        {call.duration === 'live'
          ? <span className="text-[13px] font-semibold text-neon-teal">● live</span>
          : <span className="text-[13px] text-text-2 font-mono">{call.duration}</span>}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 justify-end">
          {[Play, FileText, MoreHorizontal].map((Icon, i) => (
            <button key={i} className="w-7 h-7 rounded-[6px] grid place-items-center text-text-3 hover:text-text-1 hover:bg-white/[0.06] transition-all"><Icon className="w-3 h-3" /></button>
          ))}
        </div>
      </td>
    </tr>
  )
}

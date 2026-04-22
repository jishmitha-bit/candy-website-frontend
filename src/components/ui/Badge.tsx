import type { CallStatus } from '../../types'

interface StatusBadgeProps {
  status: CallStatus
  label: string
}

const statusStyles: Record<CallStatus, string> = {
  completed: 'bg-neon-green/15 text-neon-green',
  declined: 'bg-neon-red/15 text-neon-red',
  noanswer: 'bg-text-3/15 text-text-3',
  rescheduled: 'bg-neon-amber/15 text-neon-amber',
  inprogress: 'bg-neon-blue/15 text-neon-blue',
  followup: 'bg-purple-hi/15 text-purple-hi',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-wider ${statusStyles[status]}`}>
      {status === 'inprogress' && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse-slow" />
      )}
      {label}
    </span>
  )
}

interface NavBadgeProps {
  children: React.ReactNode
}

export function NavBadge({ children }: NavBadgeProps) {
  return (
    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-purple/15 text-purple-hi font-semibold tracking-wider">
      {children}
    </span>
  )
}

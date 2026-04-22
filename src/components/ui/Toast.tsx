import { CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import type { ToastItem } from '../../types'

function ToastCard({ toast }: { toast: ToastItem }) {
  const removeToast = useAppStore((s) => s.removeToast)

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-neon-green" />,
    info: <Info className="w-4 h-4 text-neon-blue" />,
    error: <XCircle className="w-4 h-4 text-neon-red" />,
  }

  return (
    <div className="toast-enter flex items-center gap-3 min-w-72 px-4 py-3 rounded-[14px] border border-border-strong backdrop-blur-xl text-sm"
      style={{ background: 'rgba(22,22,32,0.97)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)' }}>
      <span className="shrink-0">{iconMap[toast.type]}</span>
      <span className="flex-1 text-text-2">{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} className="shrink-0 text-text-4 hover:text-text-2 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts)
  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-2.5">
      {toasts.map((t) => <ToastCard key={t.id} toast={t} />)}
    </div>
  )
}

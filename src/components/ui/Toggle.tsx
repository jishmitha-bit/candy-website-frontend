interface ToggleProps {
  on: boolean
  onChange: (val: boolean) => void
  className?: string
}

export default function Toggle({ on, onChange, className = '' }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 focus:outline-none ${className}`}
      style={on ? { background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' } : { background: 'rgba(124,58,237,0.2)' }}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

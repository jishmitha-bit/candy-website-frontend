/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      colors: {
        'bg-0':            '#000000',
        'bg-1':            '#0a0a0f',
        'bg-2':            '#0f0f17',
        'bg-3':            '#14141f',
        'surface-solid':   '#16161f',
        'brand-purple':    '#755BE3',
        'brand-purple-hi': '#9B82FF',
        'brand-blue':      '#18DAFC',
        'brand-teal':      '#4FD1C5',
        'brand-green':     '#4CAF50',
        'brand-pink':      '#E65AFF',
        'brand-amber':     '#FFB547',
        'brand-red':       '#FF5C7A',
        'text-1':          '#F5F5FA',
        'text-2':          '#B4B4C8',
        'text-3':          '#7A7A92',
        'text-4':          '#4E4E63',
      },
      borderRadius: {
        sm:      '10px',
        DEFAULT: '14px',
        lg:      '20px',
        xl:      '28px',
      },
      backgroundImage: {
        'grad-brand':      'linear-gradient(135deg, #755BE3 0%, #18DAFC 100%)',
        'grad-brand-soft': 'linear-gradient(135deg, rgba(117,91,227,0.25) 0%, rgba(24,218,252,0.18) 100%)',
        'grad-pink':       'linear-gradient(135deg, #E65AFF 0%, #755BE3 100%)',
        'grad-teal':       'linear-gradient(135deg, #18DAFC 0%, #4FD1C5 100%)',
        'grad-hero':       'radial-gradient(ellipse at 50% 0%, rgba(117,91,227,0.25) 0%, rgba(24,218,252,0.08) 35%, transparent 70%)',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(117, 91, 227, 0.35)',
        'glow-blue':   '0 0 40px rgba(24, 218, 252, 0.25)',
        'card':        '0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
        'btn-primary': '0 10px 30px -10px rgba(117,91,227,0.6)',
      },
      keyframes: {
        aura: {
          '0%':   { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(1.15) rotate(10deg)' },
        },
        shine: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.4)', opacity: '0.6' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%':           { transform: 'translateY(-4px)', opacity: '1' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        rowFlash: {
          '0%':   { background: 'rgba(24,218,252,0.08)' },
          '100%': { background: 'transparent' },
        },
        toastIn: {
          'from': { transform: 'translateX(20px)', opacity: '0' },
          'to':   { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'aura':      'aura 8s ease-in-out infinite alternate',
        'shine':     'shine 3s infinite',
        'pulse-dot': 'pulse 2s infinite',
        'pulse-sm':  'pulse 1.5s infinite',
        'typing':    'typing 1.4s infinite ease-in-out',
        'shimmer':   'shimmer 2s infinite',
        'fade-up':   'fadeUp 0.4s ease-out both',
        'row-flash': 'rowFlash 1.2s ease-out',
        'toast-in':  'toastIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

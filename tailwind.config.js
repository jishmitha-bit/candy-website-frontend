/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#7C3AED',
          hi: '#A78BFA',
        },
        neon: {
          blue: '#22D3EE',
          teal: '#7C3AED',
          green: '#A78BFA',
          pink: '#C084FC',
          amber: '#F59E0B',
          red: '#FF4560',
        },
        bg: {
          0: '#04020A',
          1: '#0E0820',
          2: '#160D30',
          3: '#1E1040',
        },
        surface: {
          DEFAULT: 'rgba(14,8,32,0.65)',
          solid: '#0E0820',
          elev: 'rgba(22,13,48,0.75)',
        },
        text: {
          1: '#EDE9FE',
          2: '#A78BFA',
          3: '#8B5CF6',
          4: '#4C1D95',
        },
        border: {
          DEFAULT: 'rgba(124,58,237,0.1)',
          strong: 'rgba(124,58,237,0.18)',
          accent: 'rgba(124,58,237,0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '14px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(124,58,237,0.35)',
        'glow-blue': '0 0 40px rgba(34,211,238,0.2)',
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2s infinite',
        fadeUp: 'fadeUp 0.4s ease-out both',
        aura: 'aura 8s ease-in-out infinite alternate',
        typing: 'typing 1.4s infinite ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        aura: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(1.15) rotate(10deg)' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'tv': '1920px',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        bg: {
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          elevated:  'var(--bg-elevated)',
          surface:   'var(--bg-surface)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          muted:   'var(--accent-muted)',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light:   '#F0D060',
          dark:    '#A88B20',
          muted:   'rgba(212,175,55,0.12)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          hover:   'var(--danger-hover)',
          muted:   'var(--danger-muted)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
        },
        border: {
          DEFAULT: 'var(--border)',
          active:  'var(--border-active)',
        },
        'on-accent':      'var(--on-accent)',
        'input-bg':       'var(--input-bg)',
        'scrim':          'var(--scrim)',
        'surface-raised': 'var(--surface-raised)',
        success:  'var(--success)',
        error:    'var(--error)',
        warning:  'var(--warning)',
        info:     'var(--info)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #A88B20 100%)',
        'gold-gradient':  'linear-gradient(135deg, #D4AF37, #F0D060)',
        'danger-gradient':'linear-gradient(135deg, #C0392B, #E74C3C)',
      },
      borderRadius: {
        'card':   '14px',
        'input':  '10px',
        'button': '10px',
        'badge':  '9999px',
      },
      boxShadow: {
        'card':       '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.15)',
        'gold':       '0 0 20px rgba(212,175,55,0.25)',
        'gold-sm':    '0 0 10px rgba(212,175,55,0.2)',
        'dropdown':   '0 12px 32px rgba(0,0,0,0.6)',
        'toast':      '0 6px 20px rgba(0,0,0,0.5)',
      },
      animation: {
        'spin-slow':   'spin 3s linear infinite',
        'glow-pulse':  'glow-pulse 2s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'slide-up':    'slide-up 0.3s ease-out',
        'fade-in':     'fade-in 0.3s ease-out',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212,175,55,0.3)' },
          '50%':       { boxShadow: '0 0 25px rgba(212,175,55,0.6), 0 0 50px rgba(212,175,55,0.2)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}

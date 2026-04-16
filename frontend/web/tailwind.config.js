/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // Super Admin accent (cyan)
        brand: {
          50:  '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          400: '#26C6DA',
          500: '#0891B2',
          600: '#0E7490',
          700: '#155E75',
        },
        // App surface
        surface: {
          app:     '#F0F4F8',
          card:    '#FFFFFF',
          sidebar: '#FFFFFF',
          input:   '#F8FAFC',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
        panel: '0 2px 8px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
      },
      fontSize: {
        '2xs': ['9px',  { lineHeight: '1.4' }],
        xs:    ['10px', { lineHeight: '1.5' }],
        sm:    ['11px', { lineHeight: '1.5' }],
        base:  ['12px', { lineHeight: '1.6' }],
        md:    ['13px', { lineHeight: '1.6' }],
        lg:    ['14px', { lineHeight: '1.6' }],
        xl:    ['16px', { lineHeight: '1.5' }],
        '2xl': ['18px', { lineHeight: '1.4' }],
        '3xl': ['20px', { lineHeight: '1.3' }],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'blink-alert': 'blink-alert 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        'blink-alert': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
          '50%':      { opacity: '0.7', boxShadow: '0 0 0 6px rgba(239,68,68,0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

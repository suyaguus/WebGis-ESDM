/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Backgrounds ───────────────────────────── */
        'bg-app':     '#f0f4f8',   /* slate-blue-50: page bg */
        'bg-sidebar': '#ffffff',   /* pure white sidebar */
        'bg-card':    '#ffffff',   /* white cards */
        'bg-card2':   '#f8fafc',   /* slightly off-white nested */
        'bg-card3':   '#f1f5f9',   /* light gray fills */

        /* ── Accents ────────────────────────────────── */
        'accent-cyan':   '#0891b2',   /* cyan-600  — primary */
        'accent-blue':   '#2563eb',   /* blue-600 */
        'accent-amber':  '#d97706',   /* amber-600 */
        'accent-red':    '#dc2626',   /* red-600 */
        'accent-green':  '#16a34a',   /* green-600 */
        'accent-purple': '#7c3aed',   /* violet-600 */
        'accent-teal':   '#0d9488',   /* teal-600 */

        /* ── Accent fills (light bg) ─────────────────  */
        'fill-cyan':   '#ecfeff',
        'fill-blue':   '#eff6ff',
        'fill-amber':  '#fffbeb',
        'fill-red':    '#fef2f2',
        'fill-green':  '#f0fdf4',
        'fill-purple': '#f5f3ff',

        /* ── Text ───────────────────────────────────── */
        'text-primary':   '#0f172a',   /* slate-900 */
        'text-secondary': '#475569',   /* slate-600 */
        'text-muted':     '#94a3b8',   /* slate-400 */

        /* ── Borders ────────────────────────────────── */
        'border-base':  '#e2e8f0',   /* slate-200 */
        'border-light': '#f1f5f9',   /* slate-100 */
        'border-strong':'#cbd5e1',   /* slate-300 */
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)',
        'card-hover': '0 4px 12px 0 rgba(15,23,42,0.08), 0 2px 4px -1px rgba(15,23,42,0.04)',
        'sidebar': '1px 0 0 0 #e2e8f0',
        'topbar':  '0 1px 0 0 #e2e8f0',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.3' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        blink:        'blink 1.5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

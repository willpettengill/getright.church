/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core semantic tokens
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        // Background layers
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-elevated': 'var(--bg-elevated)',
        // Text layers
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-faint': 'var(--text-faint)',
        // Accent
        'accent-primary': 'var(--accent-primary)',
        'accent-dark': 'var(--accent-dark)',
        'accent-deeper': 'var(--accent-deeper)',
        'accent-light': 'var(--accent-light)',
        'accent-bright': 'var(--accent-bright)',
        'accent-glow': 'var(--accent-glow)',
        // Neutral
        'neutral-muted': 'var(--neutral-muted)',
        'neutral-mid': 'var(--neutral-mid)',
        'neutral-light': 'var(--neutral-light)',
        'border-color': 'var(--border)',
        // Status
        'status-positive': 'var(--status-positive)',
        'status-negative': 'var(--status-negative)',
        'status-warning': 'var(--status-warning)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'monospace'],
        display: ['var(--font-display)', 'Bebas Neue', 'Impact', 'sans-serif'],
      },
      fontSize: {
        xs:    ['0.6875rem', { lineHeight: '1.5' }],
        sm:    ['0.8125rem', { lineHeight: '1.5' }],
        base:  ['0.9375rem', { lineHeight: '1.6' }],
        lg:    ['1.0625rem', { lineHeight: '1.5' }],
        xl:    ['1.25rem',   { lineHeight: '1.4' }],
        '2xl': ['1.5rem',    { lineHeight: '1.3' }],
        '3xl': ['2rem',      { lineHeight: '1.1' }],
        '4xl': ['2.75rem',   { lineHeight: '1.05' }],
        '5xl': ['3.75rem',   { lineHeight: '1' }],
        '6xl': ['5rem',      { lineHeight: '1' }],
        'hero': ['7.5rem',   { lineHeight: '0.92' }],
      },
      lineHeight: {
        tight: '1.3',
        normal: '1.5',
        relaxed: '1.6',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        base: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
    },
  },
  plugins: [],
}

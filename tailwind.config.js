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
        // Semantic design tokens based on aesthetic system
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        accent: 'var(--accent-primary)',
        'accent-dark': 'var(--accent-dark)',
        'neutral-muted': 'var(--neutral-muted)',
        'neutral-light': 'var(--neutral-light)',
        'status-positive': 'var(--status-positive)',
        'status-negative': 'var(--status-negative)',
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
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

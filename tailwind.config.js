/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: 'rgb(var(--bg-page-rgb) / <alpha-value>)',
          surface: 'rgb(var(--bg-surface-rgb) / <alpha-value>)',
          card: 'rgb(var(--bg-card-rgb) / <alpha-value>)',
          cardHover: 'rgb(var(--bg-card-hover-rgb) / <alpha-value>)',
          border: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          subtle: 'rgb(var(--bg-subtle-rgb) / <alpha-value>)',
        },
        brand: {
          navy: 'rgb(var(--bg-sidebar-rgb) / <alpha-value>)',
          navyDark: 'rgb(var(--bg-sidebar-active-rgb) / <alpha-value>)',
          primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          primaryHover: 'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
          primaryLight: 'rgb(var(--color-primary-light-rgb) / <alpha-value>)',
          accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'rgb(var(--bg-sidebar-rgb) / <alpha-value>)',
          hover: 'rgb(var(--bg-sidebar-hover-rgb) / <alpha-value>)',
          active: 'rgb(var(--bg-sidebar-active-rgb) / <alpha-value>)',
          text: 'var(--text-sidebar)',
          muted: 'var(--text-sidebar-muted)',
          border: 'var(--border-sidebar)',
        },
        sky: {
          50: 'rgb(var(--color-primary-light-rgb) / <alpha-value>)',
          100: '#E0E3FD',
          200: '#C7CDFC',
          300: '#A5B0FA',
          400: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          500: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          600: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          700: 'rgb(var(--color-primary-hover-rgb) / <alpha-value>)',
          800: 'rgb(var(--color-primary-active-rgb) / <alpha-value>)',
          900: '#2A1C91',
          950: '#180E5E',
        },
        // Strict Roadmap Status Colors
        status: {
          active: 'var(--status-active)',
          pending: 'var(--status-pending)',
          investigating: 'var(--status-investigating)',
          resolved: 'var(--status-resolved)',
          rejected: 'var(--status-rejected)',
          hidden: 'var(--status-hidden)',
          deleted: 'var(--status-deleted)',
          suspended: 'var(--status-suspended)',
          banned: 'var(--status-banned)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'xs': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'sm': '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        modal: '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}

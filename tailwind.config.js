/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: 'var(--border-color)',
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'Work Sans', 'system-ui', 'sans-serif'],
        'display': ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'btn': 'var(--radius-btn)',
        'card': 'var(--radius-card)',
      }
    },
  },
  plugins: [],
}
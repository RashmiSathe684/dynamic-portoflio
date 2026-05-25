/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Outfit'", "'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        'brand-primary': "var(--brand-primary)",
        'brand-bg': "var(--brand-bg)",
        'brand-surface': "var(--brand-surface)",
        'brand-border': "var(--brand-border)",
        'brand-dark': "var(--brand-dark)",
        'brand-gray': "var(--brand-gray)",
        'brand-muted': "var(--brand-muted)",
        'text-main': "var(--text-main)",
        'text-muted': "var(--text-muted)",
        
        // Exact custom theme colors from portfolio.html
        'accent': "var(--accent)",
        'accent-h': "var(--accent-h)",
        'peach': "var(--peach)",
        'pink': "var(--pink)",
        'coral': "var(--coral)",
        'cyan': "var(--cyan)",
        'h-text': "var(--h-text)",
        'dark': "var(--dark)",
      },
    },
  },
  plugins: [],
};

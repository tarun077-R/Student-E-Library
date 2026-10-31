import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        navy: {
          950: '#0c1017',
          900: '#0e131f',
          850: '#131926',
          800: '#161e2e',
          700: '#1e2638',
          600: '#28334a',
          500: '#3e4d6e',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(59, 130, 246, 0.25)',
        'glow-md': '0 0 25px -4px rgba(59, 130, 246, 0.35)',
        'glow-lg': '0 0 35px -5px rgba(59, 130, 246, 0.45)',
        'book-spine': 'inset 0 0 30px rgba(0, 0, 0, 0.15), 0 15px 35px rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        book: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;

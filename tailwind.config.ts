import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Norvex Red — darker, deeper
        brand: {
          50: '#fff1f1',
          100: '#ffd6d6',
          200: '#ffadad',
          300: '#ff7a7a',
          400: '#e63838',
          500: '#a30000',
          600: '#7c0000', // primary
          700: '#660202',
          800: '#4a0303',
          900: '#330202',
          950: '#1a0000',
        },
        red: {
          500: '#a30000',
          600: '#7c0000',
          700: '#660202',
        },
        // Norvex Silver — visibly silver/gray, never reads as white
        silver: {
          50: '#dcdcdc',
          100: '#b8b8b8', // primary "silver" tone — clearly grey, not white
          200: '#a8a8a8',
          300: '#969696',
          400: '#808080',
          500: '#6a6a6a',
          600: '#555555',
          700: '#404040',
        },
        // Dark surfaces
        ink: {
          950: '#080808',
          900: '#0d0d0d',
          800: '#141414',
          700: '#1c1c1c',
          600: '#232323',
          500: '#2e2e2e',
          400: '#4a4a4a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', '"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      letterSpacing: {
        widest: '0.25em',
      },
      boxShadow: {
        'red-sm': '0 4px 14px 0 rgba(124, 0, 0, 0.35)',
        'red-md': '0 8px 24px -2px rgba(124, 0, 0, 0.45)',
        'red-lg': '0 14px 40px -6px rgba(124, 0, 0, 0.55)',
        'red-glow': '0 0 28px rgba(163, 0, 0, 0.4)',
        'card': '0 6px 20px -4px rgba(0, 0, 0, 0.6)',
      },
      dropShadow: {
        'red': '0 0 18px rgba(163, 0, 0, 0.45)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#B08D57',
          50: '#F5F2ED',
          100: '#EBE5DB',
          200: '#D4C4AD',
          300: '#C2AA87',
          400: '#B08D57',
          500: '#8E7246',
          600: '#6C5635',
          700: '#4A3B24',
          800: '#281F13',
          900: '#060402',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        brandIvory: {
          light: '#F5F5DC',
          DEFAULT: '#FFFFF0',
          dark: '#E6E6D1',
        },
        brandGold: {
          light: '#D4AF37',
          DEFAULT: '#B08D57',
          dark: '#996515',
        },
        brandGray: {
          light: '#F5F5F5',
          DEFAULT: '#808080',
          dark: '#333333',
        }
      },
      fontFamily: {
        sans: ['var(--font-montserrat)'],
        serif: ['var(--font-playfair-display)'],
      },
      borderRadius: {
        lg: 'var(--radius, 0.75rem)',
        md: 'calc(var(--radius, 0.75rem) - 2px)',
        sm: 'calc(var(--radius, 0.75rem) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
} 
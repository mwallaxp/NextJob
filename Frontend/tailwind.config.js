/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        orange: {
          50: '#FFF8F3',
          100: '#FFE8D6',
          200: '#FFD4AD',
          300: '#FFC084',
          400: '#FFAC5B',
          500: '#FF8C42', // Primary Orange
          600: '#FF7A1F',
          700: '#E67E1A',
          800: '#CC6B14',
          900: '#99500D',
        },
        // Secondary Neutral Colors
        black: {
          50: '#F7F3F0',
          100: '#E8E4E0',
          200: '#D4C8C0',
          300: '#B8ACA4',
          400: '#9C9088',
          500: '#6B6460',
          600: '#5A5350',
          700: '#423E3A',
          800: '#2A2724',
          900: '#1A1A1A', // Deep Black
        },
        // Complementary Accent Colors
        teal: {
          50: '#F0F9FC',
          500: '#1B4B6F', // Professional teal
          600: '#164258',
          700: '#11313F',
        },
        gold: {
          50: '#FFFBF7',
          400: '#E6C200',
          500: '#D4AF37', // Warm gold accent
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg-custom': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
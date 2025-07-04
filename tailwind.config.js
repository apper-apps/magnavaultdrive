/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        secondary: '#6366F1',
        accent: '#10B981',
        surface: '#F8FAFC',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        info: '#0891B2'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.05)',
        'float': '0 4px 12px rgba(0,0,0,0.1)',
        'deep': '0 8px 24px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
}
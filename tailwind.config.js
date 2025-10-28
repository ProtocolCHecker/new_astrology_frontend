/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cosmic-dark': '#0F0F1E',
        'cosmic-purple': '#1a1a2e',
        'cosmic-blue': '#16213e',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
      },
      fontFamily: {
        'cosmic': ['Inter', 'system-ui', 'sans-serif'],
        'cinzel': ['Cinzel', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'philosopher': ['Philosopher', 'sans-serif'],
      },
      letterSpacing: {
        'mystical': '0.05em',
        'cosmic': '0.1em',
      },
      textShadow: {
        'gold-glow': '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2)',
        'silver-glow': '0 0 10px rgba(192, 192, 192, 0.5), 0 0 20px rgba(192, 192, 192, 0.3), 0 0 30px rgba(192, 192, 192, 0.2)',
        'cosmic-glow': '0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)',
        'subtle-glow': '0 0 5px rgba(255, 255, 255, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'twinkle': 'twinkle 4s linear infinite',
        'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700' },
          '100%': { boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        'text-shimmer': {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-gold-glow': {
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2)',
        },
        '.text-shadow-silver-glow': {
          textShadow: '0 0 10px rgba(192, 192, 192, 0.5), 0 0 20px rgba(192, 192, 192, 0.3), 0 0 30px rgba(192, 192, 192, 0.2)',
        },
        '.text-shadow-cosmic-glow': {
          textShadow: '0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)',
        },
        '.text-shadow-subtle-glow': {
          textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
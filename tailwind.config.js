/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')


module.exports = {
  content: [
    "./src/**/*.{js,ts,tsx,jsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors
      colors: {
        primary: {
          DEFAULT: '#418BF9',
          main: '#418BF9',
          light: '#e8f1fe',
          dark: '#075DDF',
        },
        success: {
          DEFAULT: '#1DB954',
        },
        error: {
          DEFAULT: '#F94141',
          dark: '#D00707',
        }
      },


      // Keyframes
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(.85)', opacity: 0 },
          '50%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

        scaleDown: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.05)', opacity: 1 },
          '80%': { transform: 'scale(0.90)', opacity: 0 },
          '100%': { transform: 'scale(0.85)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          // '0%': { opacity: 1 },
          // '100%': { opacity: 0 },
          '0%': { opacity: 1 },
          '50%': { opacity: 1 },
          '80%': { opacity: 0 },
          '100%': { opacity: 0 },
        },
        linePulse: {
          // '0%': { transform: 'scale(1)', opacity: 1 },
          // '75%': { transform: 'scale(2)', opacity: 0 },
          // '100%': { transform: 'scale(2)', opacity: 0 },
          '0%': { width: '100%', height: '100%', marginTop: '0%', marginLeft: '0%', opacity: 1 },
          '75%': { width: '300%', height: '300%', marginTop: '-100%', marginLeft: '-100%', opacity: 0 },
          '100%': { width: '300%', height: '300%', marginTop: '-100%', marginLeft: '-100%', opacity: 0 },
        },
      },

      // Animations
      animation: {
        'scale-up': 'scaleUp .35s',
        'scale-down': 'scaleDown .3s',
        'fade-in': 'fadeIn .35s',
        'fade-out': 'fadeOut .3s',
        'line-pulse': 'linePulse 2s infinite',
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('not-last', '&:not(:last-child)');
      addVariant('not-last-child', '& > *:not(:last-child)');
    }),
    require('tailwindcss-safe-area'),
  ],
}

/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')


module.exports = {
  content: [
    "./src/**/*.{js,ts,tsx,jsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
        
      },

      // Fonts
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
      },

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
        },

        divider: {
          DEFAULT: '#E9E9E9',
        },
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
        'dot-pulse': {
          '0%, 80%, 100%': { opacity: 0.3 },
          '40%': { opacity: 1 },
        },
        tap: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        tapPing: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(2)', opacity: 0 },
        }
      },

      // Animations
      animation: {
        'scale-up': 'scaleUp .35s',
        'scale-down': 'scaleDown .3s',
        'fade-in': 'fadeIn .35s',
        'fade-out': 'fadeOut .3s',
        'line-pulse': 'linePulse 2s infinite',
        'dot-pulse': 'dot-pulse 1.2s infinite ease-in-out both',
        'tap': 'tap 1.5s infinite',
        'tap-ping': 'tapPing 1.5s infinite',
        'tap-ping-2': 'tapPing 2.5s infinite',
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('not-last', '&:not(:last-child)');
      addVariant('not-last-child', '& > *:not(:last-child)');
      addVariant('not-first-child', '& > *:not(:first-child)');
    }),
    require('tailwindcss-safe-area'),
  ],
}

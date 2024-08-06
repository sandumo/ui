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
        }
      },


      // Keyframes
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(.85)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

        scaleDown: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.85)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },

      // Animations
      animation: {
        'scale-up': 'scaleUp .25s',
        'scale-down': 'scaleDown .25s',
        'fade-in': 'fadeIn .25s',
        'fade-out': 'fadeOut .25s',
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

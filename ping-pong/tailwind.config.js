/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-5px) translateX(5px)' },
          '50%': { transform: 'translateY(0) translateX(10px)' },
          '75%': { transform: 'translateY(5px) translateX(5px)' },
        },
        strike: {
          '0%, 100%': {
            opacity: '0.2',
            transform: 'translateX(0)',
            filter: 'drop-shadow(0 0 5px yellow)',
          },
          '20%, 80%': { opacity: '1', filter: 'drop-shadow(0 0 20px yellow)' },
          '30%, 50%, 70%': { transform: 'translateX(-2px)' },
          '40%, 60%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        strike: 'strike 1s infinite',
      },
      dropShadow: {
        yellow: '0 0 10px yellow',
      },
      colors: {
        lightningYellow: '#FFFB00',
      },
    },
  },
  plugins: [],
}

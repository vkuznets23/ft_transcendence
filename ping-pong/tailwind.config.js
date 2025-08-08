/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // theme: {
  //   extend: {},
  // },
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-5px) translateX(5px)' },
          '50%': { transform: 'translateY(0) translateX(10px)' },
          '75%': { transform: 'translateY(5px) translateX(5px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

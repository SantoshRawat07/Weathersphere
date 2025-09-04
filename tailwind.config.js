/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   
  ],
  theme: {
    extend: {
      keyframes: {
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.6' },
        },
      },
      animation: {
        fadein: 'fadein 0.5s ease-in',
      },
    },
  },
  plugins: [],
};

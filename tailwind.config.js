/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        "mainBackgroundColor": '#fff',
        "columnBackgroundColor": '#E5E7EB'
      }
    },
  },
  plugins: [],
}
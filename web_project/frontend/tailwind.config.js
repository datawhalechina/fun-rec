/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        datawhale: {
          white: '#FFFFFF',
          blue: '#2569B2',
          lightgray: '#F3F4F6',
          gray: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


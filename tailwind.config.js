/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ash: {
          100: '#EEF5F6',
          200: '#DFE9ED',
          300: '#C6D4DF',
          400: '#B4C6D6',
          600: '#6C84A8',
          700: '#516F9C',
          800: '#2E446D',
          900: '#202F4F',
        },
        indianred: {
          100: '#FDECEC',
          600: '#C64A4A',
        },
        yellow: {
          400: '#F9C778',
        },
        green: {
          500: '#1ABC9C',
        },
        gray: {
          500: '#9297A1',
          700: '#3C3E42',
        },
        border: {
          primary: '#DBE0F0',
        },
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'Inter', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        noto: ['Noto Sans TC', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
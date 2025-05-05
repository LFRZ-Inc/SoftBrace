/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A2B49', // Dark blue for primary brand color
          light: '#2E4272',
        },
        secondary: {
          DEFAULT: '#4D9DE0', // Light blue for accent color
          dark: '#3D7EB3',
        },
        background: {
          light: '#F8FAFC',
          dark: '#121212',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
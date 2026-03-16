/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#edf6f6',
          100: '#d1eaea',
          200: '#a6d4d3',
          300: '#72b9b7',
          400: '#4d9b99',
          500: '#347774',
          600: '#2a5f5d',
          700: '#214a49',
          800: '#193837',
          900: '#112928',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './src/components/**/*.{jsx,tsx}',
    './src/pages/**/*.{jsx,tsx}',
    './src/layouts/**/*.{jsx,tsx}',
    './src/views/**/*.{jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0093BD',
        'primary-700': '#006B8A',
        black: '#334246',
      },
    },
  },
  plugins: [],
}

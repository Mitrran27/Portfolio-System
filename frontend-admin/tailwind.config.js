/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        cyan: { 400: '#22d3ee', 500: '#06b6d4', 900: '#164e63' },
        fuchsia: { 400: '#d946ef', 500: '#c026d3', 900: '#4a044e' },
      }
    }
  },
  plugins: []
}

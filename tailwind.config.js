/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cotton-rose': '#eeb4b3',
        'petal-pink': '#c179b9',
        'purple-x11': '#a42cd6',
        'indigo-velvet': '#502274',
        'shadow-grey': '#2f242c',
      },
    },
  },
  plugins: [],
}

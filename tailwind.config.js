/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original colors
        'cotton-rose': '#eeb4b3',
        'petal-pink': '#c179b9',
        'purple-x11': '#a42cd6',
        'indigo-velvet': '#502274',
        'shadow-grey': '#2f242c',
        
        // Better contrast versions
        'cotton-rose-light': '#ffd4d3', // Lighter for better contrast on dark
        'petal-pink-dark': '#9a4d8f', // Darker for better contrast
        'purple-bright': '#c850ff', // Brighter purple for visibility
      },
    },
  },
  plugins: [],
}

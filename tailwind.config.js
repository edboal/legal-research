/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'iron-grey': '#4c5760',
        'cool-steel': '#93a8ac',
        'sand-dune': '#d7ceb2',
        'bronze': '#cd7f32', // Bronze instead of brown
        'dim-grey': '#66635b',
        // Status colors
        'status-green': '#22c55e',
        'status-amber': '#f59e0b',
        'status-blue': '#3b82f6',
      },
    },
  },
  plugins: [],
}

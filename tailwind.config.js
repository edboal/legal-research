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
        'khaki-beige': '#a59e8c',
        'dim-grey': '#66635b',
        // Additional colors for better contrast
        'slate': {
          800: '#1e293b',
          900: '#0f172a',
        },
        'green': {
          100: '#dcfce7',
          600: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}

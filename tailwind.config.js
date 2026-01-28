/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Minimalist Color Scheme
        'primary': {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fad6a5',
          300: '#f7b96d',
          400: '#f39333',
          500: '#f07617', // Warm orange
          600: '#e1590d',
          700: '#bb420d',
          800: '#953512',
          900: '#792e12',
        },
        'dark': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524', // Main dark brown
          900: '#1c1917', // Darker brown
          950: '#0c0a09', // Darkest
        },
        'cream': {
          50: '#fefdfb',
          100: '#fdfbf7',
          200: '#faf6ed', // Light cream background
          300: '#f5ede0',
          400: '#ede1cc',
          500: '#e4d3b8',
          600: '#d1b894',
        },
        'success': '#059669',
        'warning': '#f59e0b',
        'error': '#dc2626',
        
        // Legacy color mappings for backwards compatibility
        'sand-dune': '#faf6ed', // Warm cream
        'iron-grey': '#292524', // Warm dark
        'bronze': '#f07617', // Warm orange
        'cool-steel': '#78716c', // Warm gray
        'dim-grey': '#d6d3d1', // Light warm gray
        'status-green': '#059669',
        'status-amber': '#f59e0b',
        'status-blue': '#0284c7',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

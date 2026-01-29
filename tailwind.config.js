/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optimized Readability Color Scheme
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'neutral': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        'success': '#059669',
        'warning': '#d97706',
        'error': '#dc2626',
        
        // Legacy mappings
        'sand-dune': '#f5f5f4',
        'iron-grey': '#292524',
        'bronze': '#2563eb',
        'cool-steel': '#78716c',
        'dim-grey': '#292524',
        'status-green': '#059669',
        'status-amber': '#d97706',
        'status-blue': '#2563eb',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          base: '#1a1a2e',
          accent: '#0f3460',
          highlight: '#e94560'
        }
      },
      animation: {
        'quantum-pulse': 'quantum-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'quantum-glow': 'quantum-glow 2s ease-in-out infinite'
      },
      keyframes: {
        'quantum-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        'quantum-glow': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3)' }
        }
      }
    }
  },
  plugins: []
}
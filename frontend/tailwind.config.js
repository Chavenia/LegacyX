/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          100: '#161616', // Main Dark Canvas
          90: '#262626',  // Card Surface
          80: '#393939',  // Borders / Hover state
          70: '#525252',  // Secondary borders
          60: '#6f6f6f',  // Subtle text
          50: '#8d8d8d',  // Muted text
          30: '#c6c6c6',  // Secondary text
          10: '#f4f4f4',  // Light text
          blue: {
            60: '#0f62fe', // Primary IBM Blue
            70: '#0043ce', // Active Blue
            80: '#002d9c', // Deep Blue
          },
          teal: {
            50: '#009d9a',
            60: '#007d79',
          },
          purple: {
            60: '#8a3ffc', // watsonx Purple
            70: '#6929c4',
          },
          red: {
            60: '#da1e28', // Critical / Alert
            70: '#ba1b23',
            90: '#520408',
          },
          green: {
            50: '#24a148', // Success / Low Risk
            60: '#198038',
            90: '#044317',
          },
          yellow: {
            30: '#f1c21b', // Warning / Medium
          },
          orange: {
            40: '#ff832b', // High Risk
          }
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'carbon': '0 2px 6px rgba(0, 0, 0, 0.4)',
        'carbon-lg': '0 8px 24px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}

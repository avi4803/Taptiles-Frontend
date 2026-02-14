/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#6467f2", // Updated primary from HTML
        "background-light": "#f6f6f8",
        "background-dark": "#101122",
        "surface-dark": "#1c1d33",
        "surface-light": "#ffffff",
      },
      fontFamily: {
        "display": ['"Inter"', "sans-serif"],
        "mono": ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        'glow': '0 0 15px -3px rgba(100, 103, 242, 0.3)',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite reverse',
        'float-fast': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}


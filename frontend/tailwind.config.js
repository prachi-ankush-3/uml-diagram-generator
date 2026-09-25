/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          900: '#0b0e17',
          800: '#11151f',
          700: '#444e68',
          600: '#1f2536',
        },
        accent: {
            blue: '#5b8cff',   // primary accent
    purple: '#a35bff', // secondary accen
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

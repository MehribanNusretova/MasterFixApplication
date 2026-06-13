/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a0505', // Tünd bordo
          light: '#3a0a0a',
          accent: '#880808', // Canlı bordo
        },
        glass: {
          bg: 'rgba(26, 5, 5, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
        }
      },
      backgroundImage: {
        'master-gradient': 'linear-gradient(135deg, #1a0505 0%, #3a0a0a 100%)',
        'premium-gradient': 'linear-gradient(135deg, #880808 0%, #1a0505 100%)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#baeb25ff',
        secondary: '#EA580C',
        wood: '#7A3E12',
        beige: '#D9B382',
        surface: '#FFF7ED',
        'dark-bg': '#0F0A06',
        'dark-card': '#1C110A',
        'dark-border': '#2E1A0E',
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
        btn: '0.5rem',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-card': '0 4px 30px rgba(249, 115, 22, 0.1)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#16a34a',
        'primary-light': '#22c55e',
        'primary-dark': '#15803d',
        'black': '#000000',
        'white': '#ffffff',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'fadeInDown': 'fadeInDown 0.8s ease-out forwards',
        'fadeInLeft': 'fadeInLeft 0.8s ease-out forwards',
        'fadeInRight': 'fadeInRight 0.8s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'scaleIn': 'scaleIn 0.5s ease-out forwards',
        'slideUp': 'slideUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-earth': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #16a34a 100%)',
      },
    },
  },
  plugins: [],
}

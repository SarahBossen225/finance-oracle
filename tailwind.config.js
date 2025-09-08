/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          green: '#10b981',
          emerald: '#059669',
          teal: '#0d9488',
        },
      },
      backgroundImage: {
        'finance-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
    },
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'font-grey': '#646464', 
        'black' : '#000',
        'white' : '#fff',
        'theme' : '#ff385c',
        'light-grey' : '#f7f7f7',
        'grey': '#ddd',
        'full-side-shadow': '0 0 15px 5px rgba(0, 0, 0, 0.1)',
        // Add more custom colors here if needed
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(0.2)' , translate: '200%'  },
          '100%': { transform: 'scale(1)' , translate: '50px' },
        },
        scaleIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.2)' },
        },
      },
      animation: {
        scaleUp: 'scaleUp 0.2s ease-in-out',
        scaleIn: 'scaleIn 0.2s ease-in-out',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        movePattern: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(50px, -50px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        bounceOrb: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.8, filter: 'blur(2px)' },
          '50%': { opacity: 1, filter: 'blur(4pxx)' },
        },
        randomBounce: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(40px, -30px)' },
          '50%': { transform: 'translate(-50px, 20px)' },
          '75%': { transform: 'translate(30px, 40px)' },
        },
      },
      animation: {
        movePattern: 'movePattern 10s infinite ease-in-out',
        bounceOrb: 'bounceOrb 3s infinite ease-in-out',
        glowPulse: 'glowPulse 5s infinite ease-in-out',
        randomBounce: 'randomBounce 6s infinite ease-in-out',
      },
      colors: {
        "sunbeam-yellow": "#F9F871",  // Bright and cheerful
        "golden-glow": "#FFCC59",     // Warm golden hue
        "peach-ember": "#FF9D68",     // Soft peachy-orange
        "rosy-blaze": "#FF6F8C",      // Vivid pink-red
        "magenta-spark": "#FF55B9",   // Bold magenta-pink
        "lavender-magenta": "#BC5CE1", // A blend of purple and magenta
        "pink-fuchsia": "#FF55B9",    // Bright and vivid pink
        "coral-pink": "#FF6F8C",      // A softer coral-like pink
        "peach-orange": "#FF9D68",    // A peachy tone with orange hints
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(to bottom right, #BC5CE1, #FF55B9, #FF9D68, #FFCC59)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // App pages
    './src/app/**/*.{js,ts,jsx,tsx}',
    // Components
    './src/components/**/*.{js,ts,jsx,tsx}',
    // All other JS/TSX files for component discovery
    './src/**/*.?(js|ts|jsx|tsx)',
  ],

  theme: {
    extend: {},
  },

  plugins: [
    // Required for Next.js 14+ to auto-detect Tailwind classes
    require('tailwindcss/plugin').default((api) => {
      api.addUtilities({
        '.sr-only': {
          'position': 'absolute',
          'width': '1px',
          'height': '1px',
          'padding': '0',
          'overflow': 'hidden',
          'clip': 'rect(0, 0, 0, 0)',
          'whiteSpace': 'nowrap',
          'borderWidth': '0',
        },
      });
    }),
  ],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'Moderate-blue': 'hsl(238, 40%, 52%)',
        'Soft-Red': 'hsl(358, 79%, 66%)',
        'Light-grayish-blue': 'hsl(239, 57%, 85%)',
        'Pale-red': 'hsl(357, 100%, 86%)',
        'Dark-blue': 'hsl(212, 24%, 26%)',
        'Grayish-Blue': 'hsl(211, 10%, 45%)',
        'Light-gray': 'hsl(223, 19%, 93%)',
        'Very-light-gray': 'hsl(228, 33%, 97%)',
        'White': 'hsl(0, 0%, 100%)',
      },
    },
  },
  plugins: [],
}
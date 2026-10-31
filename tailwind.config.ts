import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8F5EE', // Warm off-white / ivory
          card: '#FFFFFF',
          gold: '#B58D59', // Muted earthy gold / ochre
          goldDark: '#9A7542',
          goldLight: '#E8D8C3',
          goldBg: '#B68E5A', // The distinctive golden brown section bg
          dark: '#1C1B1A', // Charcoal / near-black
          darkHover: '#2E2D2B',
          footer: '#1A1A1A',
          muted: '#6B6864',
          border: '#E8E3DA',
          borderDark: '#D5CEC2',
          accent: '#A0382B',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;

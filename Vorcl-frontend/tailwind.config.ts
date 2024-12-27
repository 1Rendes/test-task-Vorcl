import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'nav-pink': '#FF6EFD',
        'audio-background': '#171717',
      },
      backgroundImage: {
        'nav-background': 'linear-gradient(90deg, #FF1CF7, #00F0FF)',
      },
      fill: {
        'micro-active': '#840025',
      },
    },
  },
  plugins: [],
} satisfies Config;

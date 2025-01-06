import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/button.js',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
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
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: { background: '#121212' },
        },
      },
    }),
  ],
} satisfies Config;

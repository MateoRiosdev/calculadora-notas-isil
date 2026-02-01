import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'isil-cyan': '#00d4f4',
        'dark-bg': '#0f172a',
        'dark-panel': '#15203b',
        'dark-input': '#4a5565',
        'light-bg': '#f1f5f9',
        'footer-bg': '#030712',
        'btn-gray': '#595959',
      },
    },
  },
  plugins: [],
}
export default config

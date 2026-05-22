/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        /** Marken-Navy aus Branding (Logo, Kompass) */
        'brand-navy': '#2A2D52',
        'steel-navy': '#1A2E4E',
        'steel-blue': '#2E4E70',
        meridian: '#6D90BC',
        bernstein: '#CC9E4D',
        'off-white': '#F5F2EA',
        'ice-blue': '#E0E8EF',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};

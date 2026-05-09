/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic Dark Outdoor - Paleta base
        "dark-base": "#0B0F0E",
        "dark-surface": "#121917",
        "text-primary": "#E6ECE9",
        "text-muted": "#9BA6A1",
        "accent-gold": "#C89B3C",
        "accent-moss": "#3A5F4A",

        // Premium outdoor (Home 2) — referencia a variables CSS
        brand: {
          "forest-black": "var(--brand-forest-black)",
          "warm-sand": "var(--brand-warm-sand)",
          "soft-stone": "var(--brand-soft-stone)",
          "mountain-green": "var(--brand-mountain-green)",
          "moss-green": "var(--brand-moss-green)",
          "earth-brown": "var(--brand-earth-brown)",
          "sun-amber": "var(--brand-sun-amber)",
          charcoal: "var(--brand-charcoal)",
          "muted-gray": "var(--brand-muted-gray)",
          white: "var(--brand-white)",
        },

        // Aliases semánticos para uso común
        background: {
          DEFAULT: "#0B0F0E",
          surface: "#121917",
          primary: "#122220",
        },
        text: {
          primary: "#E6ECE9",
          muted: "#9BA6A1",
        },
        accent: {
          DEFAULT: "#C89B3C",
          moss: "#3A5F4A",
        },
      },
      fontFamily: {
        display: [
          "var(--font-fraunces)",
          "ui-serif",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        body: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
  
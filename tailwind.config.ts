import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Cores primárias Caetano
        "azul-profundo": {
          DEFAULT: "#002E5D",
          50: "#ccd5df",
          100: "#99abbe",
          200: "#66829e",
          300: "#33587d",
          DEFAULT_2: "#002E5D",
        },
        "cinza-antracite": {
          DEFAULT: "#2E3A46",
          50: "#d5d8da",
          100: "#abb0b5",
          200: "#828990",
          300: "#58616b",
        },
        "cinza-medio": {
          DEFAULT: "#9CAEB8",
          50: "#ebeff1",
          100: "#d7dfe3",
          200: "#c4ced4",
          300: "#b0bec6",
        },
        "azul-cyan": {
          DEFAULT: "#00AEEF",
          50: "#ccefFc",
          100: "#99dff9",
          200: "#66cef5",
          300: "#33bef2",
        },
        "verde-eco": {
          DEFAULT: "#49B489",
          50: "#dbf0e7",
          100: "#b6e1d0",
          200: "#92d2b8",
          300: "#6dc3a1",
        },
        "laranja-dinamico": {
          DEFAULT: "#FFA931",
          50: "#ffeed6",
          100: "#ffddad",
          200: "#ffcb83",
          300: "#ffba5a",
        },
        "amarelo-liberdade": {
          DEFAULT: "#FFD23F",
          50: "#fff6d9",
          100: "#ffedb2",
          200: "#ffe48c",
          300: "#ffdb65",
        },
        "ultra-branco": "#FFFFFF",
        claim: "#2AA8E0",
        brand: {
          primary: "#002E5D",
          secondary: "#00AEEF",
          accent: "#49B489",
          warning: "#FFA931",
          info: "#FFD23F",
          neutral: "#2E3A46",
          muted: "#9CAEB8",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-montserrat)",
          "Montserrat",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 46 93 / 0.06)",
        md: "0 4px 12px 0 rgb(0 46 93 / 0.1)",
        lg: "0 10px 30px 0 rgb(0 46 93 / 0.14)",
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1100",
        overlay: "1200",
        modal: "1300",
        toast: "1400",
        tooltip: "1500",
      },
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(0.5rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#060514",
        aurora: "#7f5bff",
        dusk: "#f88ad5",
        moss: "#5cffc0"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        serif: ["'Cormorant Garamond'", "serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      backgroundImage: {
        "veil-gradient": "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,194,229,0.35), transparent 40%), radial-gradient(circle at 50% 80%, rgba(127,91,255,0.4), transparent 45%)"
      }
    }
  },
  plugins: []
};

export default config;

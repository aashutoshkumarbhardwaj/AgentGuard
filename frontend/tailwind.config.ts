import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090E",
        surface: {
          DEFAULT: "#0E131F",
          50: "#1A2234",
          100: "#141A28",
          200: "#0F1420",
          300: "#0B0E17",
        },
        cyber: {
          emerald: "#10B981",
          amber: "#F59E0B",
          crimson: "#EF4444",
          cyan: "#06B6D4",
          violet: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "text-shimmer": "text-shimmer 3.5s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "text-shimmer": {
          "0%": {
            "background-position": "0 0",
          },
          "100%": {
            "background-position": "-200% 0",
          },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

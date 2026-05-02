import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f6f2ea",
        ink: "#16202b",
        sage: "#66725c",
        slate: "#5f7385",
        clay: "#8d6e66",
        mist: "#dce8ef"
      },
      boxShadow: {
        soft: "0 22px 80px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"]
      },
      maxWidth: {
        prosewide: "78ch"
      }
    }
  },
  plugins: []
};

export default config;

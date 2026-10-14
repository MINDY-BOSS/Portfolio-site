import type { Config } from "tailwindcss";

/**
 * Design system tokens live here. Tweak the palette in one place and the
 * whole site follows. Colors are exposed as CSS variables (see globals.css)
 * so they also work outside Tailwind (e.g. in raw GSAP-driven styles).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── EDIT ME: the whole palette ─────────────────────────────
        background: "#0A0A0A", // near-black
        foreground: "#F5F5F0", // off-white
        accent: "#E7FE55", // acid lime — used sparingly for emphasis
        muted: "#8A8A82", // dimmed text
        line: "rgba(245,245,240,0.12)", // hairline borders
      },
      fontFamily: {
        // Display face loaded from Fontshare, body from next/font (see layout.tsx)
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid oversized headline sizes
        mega: ["clamp(3rem, 13vw, 13rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        huge: ["clamp(2.5rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};

export default config;

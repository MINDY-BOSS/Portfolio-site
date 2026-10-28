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
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        line: "var(--line)",
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

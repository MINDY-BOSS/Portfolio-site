/**
 * ── EDIT ME ──────────────────────────────────────────────────────────
 * Global site content: your name, links, and copy. Change values here and
 * they propagate to the hero, contact section, and SEO metadata.
 * Anything marked [[PLACEHOLDER]] is fake — swap it for the real thing.
 */
export const site = {
  // TODO: your real name
  name: "AYINDE MARVELLOUS ADEBAYO",
  // Short role/title shown next to your name + in <title>
  role: "Software Engineer",
  // One-line status pill in the hero
  status: "Open to internships & work",
  // 2–3 sentence about blurb, in your voice
  about:
    "I help teams as a core helping hand to launch new products and improve existing products with software built around real business needs through modern frameworks from planning to deployment.\n\nI'm Ayinde Marvellous, a software engineer who turns your requirements as a major priority into practical, reliable solutions.",
  // SEO / OG description
  description:
    "Software engineer building fast, tactile, design-led product interfaces. Portfolio, selected work, and ways to get in touch.",
  // Canonical deployed URL
  url: "https://portfolio-site-jet-nine-19.vercel.app",

  // ── Links (real where known) ──────────────────────────────────────
  email: "ayindemarvellous04@gmail.com",
  github: "https://github.com/MINDY-BOSS",
  linkedin: "linkedin.com/in/marvellous-ayinde-536729265",
  resume: "/Ayinde%20Marvellous%20resume.pdf",
} as const;

export type Site = typeof site;

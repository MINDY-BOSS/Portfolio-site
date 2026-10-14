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
    "I’m a software engineer who cares about the pixels and the plumbing in equal measure. I like turning fuzzy product ideas into fast, tactile interfaces — and I sweat the details most people never notice. Currently interning and looking for design-led teams to build the next thing with.",
  // SEO / OG description
  description:
    "Software engineer building fast, tactile, design-led product interfaces. Portfolio, selected work, and ways to get in touch.",
  // Canonical deployed URL (update after deploying to Vercel)
  url: "https://your-domain.vercel.app",

  // ── Links (real where known) ──────────────────────────────────────
  email: "marvellous@centricai.io",
  github: "https://github.com/MINDY-BOSS",
  linkedin: "linkedin.com/in/marvellous-ayinde-536729265",
  resume: "/resume.pdf",
} as const;

export type Site = typeof site;

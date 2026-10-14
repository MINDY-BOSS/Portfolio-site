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
    "I design and build websites that turn visitors into customers. Most sites look fine but quietly lose sales — unclear messaging, slow pages, forgettable first impressions. I fix that with bold, intriguing designs that hook people in the first few seconds, backed by conversion-focused layouts and fast, polished code that guides them straight to your call to action. If your site isn’t pulling its weight, let’s build one that does.",
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

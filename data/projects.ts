/**
 * ── EDIT ME ──────────────────────────────────────────────────────────
 * Your projects. This is the ONLY file you touch to add / edit / reorder
 * projects — the horizontal-scroll section and the /projects/[slug] detail
 * pages both read from here.
 *
 * To add a project: copy a block, give it a unique `slug`, drop a preview
 * image in /public/projects/<slug>.svg (or .png/.jpg) and set `image`.
 */
export type Project = {
  slug: string;
  name: string;
  description: string;
  role: string;
  stack: string[];
  image: string; // path under /public
  liveUrl: string;
  repoUrl: string;
  year: string;
};

export const projects: Project[] = [
  {
    slug: "aurora",
    name: "Aurora",
    description:
      "A real-time collaborative canvas with buttery multiplayer cursors and offline-first sync.",
    role: "Full-stack · Lead",
    stack: ["Next.js", "TypeScript", "WebSockets", "Postgres"],
    image: "/projects/aurora.svg",
    liveUrl: "https://example.com", // [[live URL]]
    repoUrl: "https://github.com/yourusername/aurora", // [[repo URL]]
    year: "2025",
  },
  {
    slug: "pulse",
    name: "Pulse",
    description:
      "An analytics dashboard that turns noisy event streams into calm, glanceable insight.",
    role: "Frontend",
    stack: ["React", "D3", "Tailwind", "Node"],
    image: "/projects/pulse.svg",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/pulse",
    year: "2024",
  },
  {
    slug: "monolith",
    name: "Monolith",
    description:
      "A component library and design-token pipeline shipping one consistent system to five apps.",
    role: "Design Systems",
    stack: ["TypeScript", "Storybook", "Style Dictionary"],
    image: "/projects/monolith.svg",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/monolith",
    year: "2024",
  },
  {
    slug: "drift",
    name: "Drift",
    description:
      "A GSAP-driven marketing site experiment — scroll-scrubbed 3D and cinematic page transitions.",
    role: "Creative Dev",
    stack: ["Next.js", "GSAP", "Three.js"],
    image: "/projects/drift.svg",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yourusername/drift",
    year: "2023",
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

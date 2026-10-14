import type { BrandKey } from "@/components/BrandIcons";

/**
 * ── EDIT ME ──────────────────────────────────────────────────────────
 * Your skills, grouped. Rendered as a staggered grid of brand LOGOS in the
 * Skills section. Each item's `icon` must be a key defined in BrandIcons.tsx —
 * add a new logo path there first if you introduce a new tool.
 */
export type SkillItem = { name: string; icon: BrandKey };
export type SkillGroup = { title: string; items: SkillItem[] };

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
    ],
  },
  {
    title: "Frameworks",
    items: [
      { name: "Next.js", icon: "nextjs" },
      { name: "NestJS", icon: "nestjs" },
      { name: "React", icon: "react" },
      { name: "Material UI", icon: "mui" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "Tooling",
    items: [
      { name: "Webflow", icon: "webflow" },
      { name: "Framer", icon: "framer" },
    ],
  },
];

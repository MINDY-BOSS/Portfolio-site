# Portfolio

An award-style personal portfolio for a software engineer — maximalist motion
over clean, confident layout. Built with **Next.js (App Router) + TypeScript**,
**Tailwind CSS**, **GSAP** (ScrollTrigger + SplitText) and **Lenis** smooth
scroll.

**Live site:** https://portfolio-site-jet-nine-19.vercel.app/

## Features

- **Preloader** — 0→100 counter, then a masked panel wipe reveals the hero.
- **Hero** — oversized headline animated in *by character* (SplitText) with a
  mouse-parallax background.
- **Smooth scroll** — Lenis, wired into ScrollTrigger (one engine, no conflicts).
- **About** — copy reveals *line by line* on scroll.
- **Projects** — a pinned **horizontal-scroll** section (ScrollTrigger pin +
  scrub) with "View Live" / "View Code" buttons and `/projects/[slug]` detail
  pages.
- **Skills** — staggered grid reveal + hover micro-interactions.
- **Contact** — magnetic GitHub/LinkedIn buttons (open in a new tab), résumé
  download and email link.
- **Page transitions** — GSAP overlay wipe between routes.
- **Guardrails** — `gsap.matchMedia()` (heavy on desktop, simple on mobile),
  full `prefers-reduced-motion` support, `gsap.context()` cleanup, `next/image`
  lazy-loading, single-source plugin registration.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Requires Node 18.18+ (developed on Node 22).

## Where to edit content

All editable content lives in **`/data`** — you shouldn't need to touch
animation code to update the site.

| File               | What it controls                                          |
| ------------------ | --------------------------------------------------------- |
| `data/site.ts`     | Name, role, status pill, about blurb, email, links, résumé, SEO URL |
| `data/projects.ts` | The project list (also powers `/projects/[slug]` pages)   |
| `data/skills.ts`   | Skill groups shown in the Skills grid                     |

Placeholders are marked `[[LIKE THIS]]` — search the repo for `[[` to find
everything left to fill in (name, GitHub/LinkedIn usernames, project URLs).

### Add a project

1. Open `data/projects.ts` and copy an existing object in the `projects` array.
2. Give it a unique `slug`, fill in `name`, `description`, `role`, `stack`,
   `year`, `liveUrl`, `repoUrl`.
3. Drop a preview image at `public/projects/<slug>.svg` (or `.png` / `.jpg`)
   and point `image` at it (e.g. `"/projects/my-app.png"`).

That's it — the horizontal-scroll section and the detail page pick it up
automatically.

### Swap the placeholder assets

- **Project images** — replace the SVGs in `public/projects/`.
- **Résumé** — add `public/resume.pdf` (and delete `public/resume.txt`).
- **Favicon / OG image** — replace `public/favicon.svg` and `public/og-image.svg`.

### Change the look

- **Colors** — `tailwind.config.ts` (also mirrored as CSS vars in
  `app/globals.css`). Background, off-white, and the single accent live here.
- **Fonts** — body font (Inter) is set in `app/layout.tsx` via `next/font`; the
  display face (Clash Display) loads from Fontshare in the same file. Swap the
  family there and in `tailwind.config.ts`.

## Notes on the GSAP setup

- Plugins are registered **once** in `lib/gsap.ts`. Import `gsap`,
  `ScrollTrigger`, `SplitText` from there — never register elsewhere.
- Every component scopes its animations with `gsap.context()` (via the
  `useGsapContext` hook / `useIsomorphicLayoutEffect`) and reverts on unmount.
- The pinned horizontal scroll uses function-based `end`/`x` values plus
  `invalidateOnRefresh: true`, so **resizing won't break the pinning** — the
  most common failure mode for this pattern.
- GSAP 3.13+ ships all plugins (including SplitText) free in the core package,
  so no auth token or extra install is needed.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects
   Next.js; no config needed.
3. Update `site.url` in `data/site.ts` to your production domain (for correct
   Open Graph / canonical URLs).

Or from the CLI:

```bash
npx vercel        # preview
npx vercel --prod # production
```

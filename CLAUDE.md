# CLAUDE.md

## Project overview

This repository is a personal portfolio built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, and Lenis. The core pattern is a motion-heavy landing page with content driven from data files and reusable section components.

- App entry: [app/page.tsx](app/page.tsx)
- Project guidance: [README.md](README.md)
- Global GSAP setup: [lib/gsap.ts](lib/gsap.ts)
- Editable content: [data/site.ts](data/site.ts), [data/projects.ts](data/projects.ts), [data/skills.ts](data/skills.ts)

## Development commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # linting
npm start        # serve the production build
```

This project targets Node 18.18+ and was developed with modern Next.js + React 19.

## Architecture and conventions

### Content-first structure

Most personal/site content should be edited in the data layer instead of hardcoding copy into components.

- [data/site.ts](data/site.ts): name, role, contact links, resume, SEO metadata
- [data/projects.ts](data/projects.ts): project list and detail data used by the horizontal scroll and the dynamic project pages
- [data/skills.ts](data/skills.ts): skill groups for the skills section
- [public/projects](public/projects): project imagery and media assets

When updating portfolio content, prefer data-driven edits over component rewrites. The page sections are assembled from reusable components and consume this data.

### Animation system

GSAP is configured once in [lib/gsap.ts](lib/gsap.ts). Register plugins there and import them from that module instead of registering plugins in individual components.

- Use `gsap.context()` around component animation setup and clean it up on unmount.
- Prefer the existing `useGsapContext` hook and related layout effect helpers for component-scoped animation lifecycles.
- Keep `ScrollTrigger.refresh()` in mind after preloader-driven layout changes; the homepage intentionally refreshes after the loader completes.
- Respect reduced-motion preferences and avoid adding heavy animation logic that bypasses existing safeguards.

### Routing and pages

The project uses Next.js App Router conventions.

- Home page: [app/page.tsx](app/page.tsx)
- Project detail pages: [app/projects/[slug]/page.tsx](app/projects/[slug]/page.tsx)
- Shared layout and global styling: [app/layout.tsx](app/layout.tsx), [app/globals.css](app/globals.css)

Project slugs and metadata are driven from the `projects` data array, so adding a project usually means adding one object and matching asset files.

## Practical guidance for AI agents

- Do not treat animation code as the canonical source of content; the real source of truth is under [data](data).
- When changing a section, check the matching component and the relevant data file together.
- For GSAP work, preserve the existing cleanup and refresh behavior rather than introducing new global animation registries.
- For project additions, follow the README flow: add data entry, add preview asset under [public/projects](public/projects), and ensure the slug matches the route.
- Keep custom UI changes minimal and consistent with the existing design system: dark neutral palette, bold typography, strong motion, and clean composition.

## Useful references

- [README.md](README.md) for project purpose, content-editing workflow, and deploy notes
- [app/page.tsx](app/page.tsx) for the home page composition and loader timing
- [lib/gsap.ts](lib/gsap.ts) for the canonical GSAP plugin registration
- [data/projects.ts](data/projects.ts) for project structure examples

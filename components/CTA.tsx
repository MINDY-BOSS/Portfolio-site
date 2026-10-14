"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, SplitText } from "@/lib/gsap";
import { site } from "@/data/site";
import MagneticButton from "@/components/MagneticButton";

// Ensure external links always have a protocol (so "linkedin.com/in/…" from
// data/site.ts resolves as an absolute URL rather than a relative path).
const ext = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

// Brand marks (inline SVG so they inherit `currentColor` and add no requests).
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden focusable="false">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden focusable="false">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/**
 * CTA / Contact — big magnetic GitHub & LinkedIn buttons (new tab, never
 * navigate away from the portfolio), plus a résumé download and email link.
 * The oversized "Let's talk" headline reveals by line on scroll.
 */
export default function CTA() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new SplitText(headline.current, {
          type: "lines",
          linesClass: "mask",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
        return () => split.revert();
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      id="contact"
      className="mx-auto flex min-h-[90svh] w-full max-w-content flex-col justify-center px-6 py-32 md:px-10"
    >
      <p className="mb-8 text-sm uppercase tracking-[0.2em] text-muted">
        (Contact)
      </p>

      <h2
        ref={headline}
        className="font-display text-mega font-bold uppercase leading-[0.9]"
      >
        Let’s
        <br />
        build.
      </h2>

      {/* Magnetic social buttons — open in a new tab, always */}
      <div className="mt-16 flex flex-col gap-4 sm:flex-row">
        <MagneticButton
          href={ext(site.github)}
          target="_blank"
          rel="noopener noreferrer"
          strength={0.5}
          className="rounded-full bg-foreground px-10 py-6 text-lg font-medium text-black transition-colors"
        >
          <GitHubIcon />
          GitHub ↗
        </MagneticButton>
        <MagneticButton
          href={ext(site.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          strength={0.5}
          className="rounded-full border border-line px-10 py-6 text-lg font-medium transition-colors hover:border-foreground"
        >
          <LinkedInIcon />
          LinkedIn ↗
        </MagneticButton>
      </div>

      {/* Résumé + email */}
      <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 text-muted">
        <a
          href={site.resume}
          download
          data-cursor
          className="group inline-flex items-center gap-2 transition-colors hover:text-accent"
        >
          <span className="underline-offset-4 group-hover:underline">
            Download résumé
          </span>
          ↓
        </a>
        <a
          href={`mailto:${site.email}`}
          data-cursor
          className="group inline-flex items-center gap-2 transition-colors hover:text-accent"
        >
          <span className="underline-offset-4 group-hover:underline">
            {site.email}
          </span>
          →
        </a>
      </div>

      <p className="mt-24 text-xs uppercase tracking-[0.2em] text-muted">
        © {site.name} — Built with Next.js, GSAP & Lenis
      </p>
    </footer>
  );
}

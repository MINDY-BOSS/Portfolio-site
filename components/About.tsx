"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { site } from "@/data/site";

/**
 * About — personality-forward copy that reveals LINE BY LINE on scroll.
 * Each line sits inside a mask (overflow-hidden) and slides up as the section
 * enters the viewport. Reduced-motion falls back to a plain fade.
 */
export default function About() {
  const root = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.from(copy.current, {
              opacity: 0,
              duration: 0.6,
              scrollTrigger: { trigger: root.current, start: "top 75%" },
            });
            return;
          }

          // Split into lines, wrap each in a mask, slide up on scroll.
          const split = new SplitText(copy.current, {
            type: "lines",
            linesClass: "mask",
          });

          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
            },
          });

          return () => split.revert();
        }
      );
    }, root);

    // Recalculate line splits & triggers after fonts load / on resize.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="about"
      className="mx-auto w-full max-w-content px-6 py-32 md:px-10 md:py-48"
    >
      <p className="mb-10 text-sm uppercase tracking-[0.2em] text-muted">
        (About)
      </p>
      <div className="grid items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)] md:gap-16">
        <p
          ref={copy}
          className="max-w-4xl whitespace-pre-line font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-semibold leading-[1.15]"
        >
          {site.about}
        </p>
        <div className="image-light-frame relative isolate aspect-[3/4] w-full p-[2px] md:mt-2">
          <div className="absolute inset-[2px] overflow-hidden">
            <Image
              src="/portfolio-image.jpeg"
              alt={`${site.name} portrait`}
              fill
              sizes="(min-width: 768px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

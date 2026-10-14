"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * app/template.tsx re-mounts on every route navigation (unlike layout.tsx),
 * which makes it the ideal place for an "enter" transition. We play a GSAP
 * overlay wipe that slides up off the screen to reveal the new page — so
 * moving between `/` and `/projects/[slug]` feels like one continuous film.
 *
 * The matching "exit" is handled by the <Transition> overlay triggered from
 * links; here we just guarantee a clean reveal after the new route mounts.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(overlay.current, { yPercent: -100, autoAlpha: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.inOut" } })
        .set(overlay.current, { yPercent: 0, autoAlpha: 1 })
        .to(overlay.current, { yPercent: -100, duration: 0.9 })
        .set(overlay.current, { autoAlpha: 0 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] bg-accent"
        style={{ transform: "translateY(0%)" }}
      />
      {children}
    </>
  );
}

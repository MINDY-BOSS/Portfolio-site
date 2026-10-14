"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * SmoothScroll — the ONE smooth-scroll engine for the whole page.
 *
 * We chose Lenis (not GSAP ScrollSmoother) and wire it into ScrollTrigger so
 * pinning/scrubbing stay perfectly in sync. Running both engines at once
 * causes double-scrolling and jitter — so only this one exists.
 *
 * Key wiring:
 *   • lenis.on("scroll", ScrollTrigger.update) — ST reads Lenis' scroll pos
 *   • gsap.ticker drives lenis.raf — one clock, no competing rAF loops
 *   • reduced-motion → skip Lenis entirely (native scroll)
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose so components (e.g. anchor scroll-to) can reach the instance.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}

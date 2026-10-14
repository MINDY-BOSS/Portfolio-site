"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Custom animated cursor — a small dot that trails the pointer with a soft
 * lag, and grows into a ring over interactive elements ([data-cursor]).
 *
 * Only active on fine-pointer (desktop) devices; on touch it renders nothing
 * and the native cursor is untouched. Respects reduced-motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    document.documentElement.classList.add("cursor-none-desktop");

    const el = dot.current!;
    // quickTo gives us a cheap, GPU-friendly follow with easing.
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const grow = () =>
      gsap.to(el, { scale: 2.6, backgroundColor: "transparent", borderColor: "var(--accent)", duration: 0.25 });
    const shrink = () =>
      gsap.to(el, { scale: 1, backgroundColor: "var(--accent)", borderColor: "transparent", duration: 0.25 });

    window.addEventListener("pointermove", move);

    // Delegate hover state to anything tagged [data-cursor]
    const interactive = () =>
      Array.from(document.querySelectorAll<HTMLElement>("a, button, [data-cursor]"));
    let targets = interactive();
    const bind = () => {
      targets = interactive();
      targets.forEach((t) => {
        t.addEventListener("pointerenter", grow);
        t.addEventListener("pointerleave", shrink);
      });
    };
    bind();

    // Re-bind when DOM changes (e.g. after preloader / route change)
    const observer = new MutationObserver(() => {
      targets.forEach((t) => {
        t.removeEventListener("pointerenter", grow);
        t.removeEventListener("pointerleave", shrink);
      });
      bind();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", move);
      observer.disconnect();
      targets.forEach((t) => {
        t.removeEventListener("pointerenter", grow);
        t.removeEventListener("pointerleave", shrink);
      });
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent bg-accent md:block"
      style={{ mixBlendMode: "difference" }}
    />
  );
}

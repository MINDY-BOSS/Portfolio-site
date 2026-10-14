"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Preloader — a 0→100 counter, then a masked panel wipe that reveals the page.
 *
 * The counter is driven by a GSAP tween on a plain object (not per-frame React
 * state churn) and written into the DOM via onUpdate. On complete, the black
 * panels slide up off-screen (overflow-hidden mask handled by fixed layer) and
 * we call onDone so the hero can start its own intro.
 *
 * Reduced-motion: skip straight to done on mount.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      onDone();
      return;
    }

    // Lock scroll while the preloader is on screen.
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setGone(true);
          onDone();
        },
      });

      tl.to(counter, {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(counter.value);
          if (count.current) count.current.textContent = String(v).padStart(3, "0");
          if (bar.current) bar.current.style.transform = `scaleX(${counter.value / 100})`;
        },
      })
        // Brief hold at 100
        .to({}, { duration: 0.25 })
        // Counter + bar fade
        .to([count.current, bar.current?.parentElement], {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.out",
        })
        // Panel wipe up — reveals the hero behind it
        .to(root.current, {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut",
        });
    }, root);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-background will-transform"
    >
      <span
        ref={count}
        className="font-display text-mega tabular-nums text-foreground"
      >
        000
      </span>
      <div className="mt-6 w-[min(60vw,420px)]">
        <div className="h-px w-full bg-line">
          <div
            ref={bar}
            className="h-px w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}

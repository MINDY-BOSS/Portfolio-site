"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import HeroParticles from "@/components/HeroParticles";

// Words the particle background cycles through behind the hero content.
const BG_WORDS = ["DESIGN", "BUILD", "SHIP", "CRAFT", "CREATE"];

/**
 * Hero — oversized headline that TYPES ITSELF OUT with a blinking caret, over a
 * particle-text background driven by a subtle mouse-parallax, plus a status
 * pill and a scroll cue. Intro fires once `start` flips true.
 */
export default function Hero({ start }: { start: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const typeTarget = useRef<HTMLSpanElement>(null); // where characters get typed
  const caret = useRef<HTMLSpanElement>(null); // blinking cursor
  const bg = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!start) return;

    const ctx = gsap.context(() => {
      // matchMedia → cinematic char animation on desktop, gentle fade on mobile
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduce } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduce: boolean;
          };

          const el = typeTarget.current;
          const full = site.name;

          // ── STEP 1: reduced-motion → no typing at all ──────────────
          // Print the whole name instantly, reveal the rest of the hero,
          // and hide the caret. Users who ask for less motion get a static,
          // fully-formed hero.
          if (reduce) {
            if (el) el.textContent = full;
            gsap.set(caret.current, { autoAlpha: 0 });
            gsap.set(".hero-fade", { opacity: 1, y: 0 });
            return;
          }

          // ── STEP 2: start from an empty headline ───────────────────
          // We type INTO an empty span, so clear whatever SSR rendered.
          if (el) el.textContent = "";

          // ── STEP 3: pick a per-character speed by breakpoint ───────
          // Desktop types a touch slower (more cinematic); mobile is snappier
          // so the name finishes quickly on a small screen.
          const perChar = isDesktop ? 0.08 : 0.05; // seconds per character

          // ── STEP 4: tween a counter, not the DOM directly ──────────
          // GSAP animates a plain number 0 → name.length; on every frame we
          // slice the string to that many characters. `steps()` makes the
          // count land on whole letters, so it reads as discrete keystrokes.
          const typed = { count: 0 };
          const tl = gsap.timeline();

          tl.to(typed, {
            count: full.length,
            duration: full.length * perChar,
            ease: `steps(${full.length})`,
            onUpdate: () => {
              if (el) el.textContent = full.slice(0, Math.round(typed.count));
            },
          })
            // ── STEP 5: after typing, fade the rest of the hero in ───
            .from(
              ".hero-fade",
              { y: 24, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.12 },
              "-=0.2"
            );
        }
      );

      // Mouse parallax on the particle background (desktop only, no reduced-motion).
      // The wrapper is oversized (-inset-16) so this drift never reveals its edges.
      if (!prefersReducedMotion()) {
        const xTo = gsap.quickTo(bg.current, "x", { duration: 1.2, ease: "power3" });
        const yTo = gsap.quickTo(bg.current, "y", { duration: 1.2, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 30;
          const ny = (e.clientY / window.innerHeight - 0.5) * 30;
          xTo(nx);
          yTo(ny);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      }
    }, root);

    return () => ctx.revert();
  }, [start]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 md:px-10"
    >
      {/* Particle-text background (parallax wrapper, oversized to hide edges) */}
      <div ref={bg} aria-hidden className="pointer-events-none absolute -inset-16 -z-10 will-transform">
        <HeroParticles words={BG_WORDS} />
      </div>
      {/* Soft accent glow to lift the particles off pure black */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle at 30% 30%, var(--accent), transparent 60%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-content">
        <p className="hero-fade mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-muted">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
          {site.status}
        </p>

        <h1 className="max-w-[15ch] font-display text-[clamp(2.25rem,8vw,7rem)] font-bold uppercase leading-[0.95] tracking-tight [text-wrap:balance]">
          {/* Typed characters land here (aria-hidden — it starts empty) */}
          <span ref={typeTarget} aria-hidden />
          {/* Blinking caret (CSS animation) */}
          <span
            ref={caret}
            aria-hidden
            className="type-caret ml-2 inline-block h-[0.82em] w-[0.06em] translate-y-[0.06em] bg-accent align-baseline"
          />
          {/* Full name for screen readers, SEO, and no-JS fallback */}
          <span className="sr-only">{site.name}</span>
        </h1>

        <div className="hero-fade mt-8 flex flex-col gap-2 text-lg text-muted md:flex-row md:items-center md:gap-6 md:text-xl">
          <span className="text-foreground">{site.role}</span>
          <span className="hidden md:inline">·</span>
          <span>Design-led product interfaces</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-fade absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
        <span>Scroll</span>
        <span className="block h-8 w-px animate-bounce bg-line" />
      </div>
    </section>
  );
}

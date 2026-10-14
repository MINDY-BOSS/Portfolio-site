"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap } from "@/lib/gsap";
import { skills } from "@/data/skills";
import { BrandIcon } from "@/components/BrandIcons";

/**
 * Skills — a grid of brand-logo tiles that reveal with a GSAP stagger on
 * scroll. Hover micro-interaction (lift + accent) is pure CSS so it stays
 * cheap and works under reduced-motion.
 */
export default function Skills() {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // immediateRender:false is the safety net: tiles render VISIBLE by
        // default and only animate when the trigger fires. Because this section
        // sits just after the pinned Projects section, a mis-measured trigger
        // could otherwise leave them stuck at opacity:0 — this guarantees they
        // are never permanently hidden.
        gsap.from(".skill-chip", {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="skills"
      className="mx-auto w-full max-w-content px-6 py-32 md:px-10 md:py-48"
    >
      <p className="mb-16 text-sm uppercase tracking-[0.2em] text-muted">
        (Skills & Stack)
      </p>

      <div className="grid gap-12 md:grid-cols-3">
        {skills.map((group) => (
          <div key={group.title}>
            <h3 className="mb-6 font-display text-xl font-semibold text-accent">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-3">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  data-cursor
                  title={item.name}
                  aria-label={item.name}
                  className="skill-chip group flex h-20 w-20 cursor-default items-center justify-center rounded-xl border border-line transition-all duration-300 ease-expo hover:-translate-y-1.5 hover:border-accent"
                >
                  <BrandIcon
                    name={item.icon}
                    className="h-9 w-9 text-foreground/85 transition-colors duration-300 group-hover:text-accent"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

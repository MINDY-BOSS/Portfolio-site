"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";
import TransitionLink from "@/components/Transition";

/**
 * ProjectsScroll — the centerpiece.
 *
 * DESKTOP: the section is PINNED while the horizontal track scrubs sideways as
 * you scroll vertically (ScrollTrigger pin + scrub). The single most common
 * failure here is broken pinning on resize, so we:
 *   • wrap everything in gsap.matchMedia() → auto re-init per breakpoint
 *   • use function-based `x` / `end` values (recomputed on refresh)
 *   • set invalidateOnRefresh:true so widths recompute on resize/orientation
 *   • let matchMedia revert (kill pin, tween, spacer) automatically on cleanup
 *
 * MOBILE: no pin — cards stack vertically with a light fade-in, which is
 * cheaper and avoids fragile horizontal pinning on small/again-resizing screens.
 */
export default function ProjectsScroll() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── DESKTOP: pinned horizontal scrub ──────────────────────────
      mm.add("(min-width: 768px)", () => {
        const el = track.current!;
        const amount = () => el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: () => -amount(),
          ease: "none",
        });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          animation: tween,
          anticipatePin: 1,
          invalidateOnRefresh: true, // recompute widths on resize
        });
      });

      // ── MOBILE: simple staggered fade, no pin ─────────────────────
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative md:h-[100svh] md:overflow-hidden">
      {/* Section heading (in normal flow; pinned along with the section on desktop) */}
      <div className="flex items-end justify-between px-6 pb-10 pt-24 md:px-10 md:pt-16">
        <h2 className="font-display text-huge font-bold uppercase leading-none">
          Selected
          <br />
          Work
        </h2>
        <span className="hidden text-sm uppercase tracking-[0.2em] text-muted md:block">
          {projects.length.toString().padStart(2, "0")} projects — scroll →
        </span>
      </div>

      {/* Horizontal track (desktop) / vertical stack (mobile) */}
      <div
        ref={track}
        className="flex flex-col gap-6 px-6 md:h-[70vh] md:flex-row md:items-stretch md:gap-8 md:px-10"
      >
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card group flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-white/[0.02] md:w-[70vw] lg:w-[46vw] xl:w-[38vw]">
      {/* Preview image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={`${project.name} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 46vw"
          className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
        />
        {project.year && (
          <span className="absolute right-4 top-4 rounded-full border border-line bg-background/60 px-3 py-1 text-xs uppercase tracking-widest text-muted backdrop-blur">
            {project.year}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <TransitionLink
          href={`/projects/${project.slug}`}
          className="font-display text-4xl font-bold transition-colors group-hover:text-accent md:text-5xl"
        >
          {project.name}
        </TransitionLink>

        <p className="mt-3 max-w-md text-muted">{project.description}</p>

        {(project.role || project.stack?.length || project.stages?.length) && (
          <div className="mt-4 space-y-1 text-sm text-muted">
            {project.role && <p>Role: {project.role}</p>}
            {project.stack?.length && (
              <p>Stack: {project.stack.join(" · ")}</p>
            )}
            {project.stages?.length && (
              <p>Stages: {project.stages.join(" · ")}</p>
            )}
          </div>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <div className="mt-auto flex gap-3 pt-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="flex-1 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-black transition-transform hover:scale-[1.02]"
              >
                View Live
              </a>
            )}
            {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="flex-1 rounded-full border border-line px-5 py-3 text-center text-sm font-medium transition-colors hover:border-foreground"
            >
              View Code
            </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

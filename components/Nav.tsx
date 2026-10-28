"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsomorphicLayoutEffect } from "@/hooks/useGsapContext";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const PRELOADER_SESSION_KEY = "portfolio-preloader-complete";

type Item = { label: string; hash: string };

// Sections the hamburger navigates to. `hash` empty string = top of page.
const ITEMS: Item[] = [
  { label: "Home", hash: "" },
  { label: "About", hash: "about" },
  { label: "Projects", hash: "work" },
  { label: "Contact", hash: "contact" },
];

// Compact initials for the top-left mark, e.g. "AYINDE MARVELLOUS ADEBAYO" -> "AM"
const initials = site.name
  .split(/\s+/)
  .slice(0, 2)
  .map((w) => w[0])
  .join("");

/**
 * Nav — a fixed top bar (initials + hamburger) that opens a full-screen menu
 * housing Home / About / Projects / Contact. On the home page, links smooth-scroll via
 * Lenis; elsewhere they navigate to /#section. Fully animated with GSAP and
 * gated by prefers-reduced-motion.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const linksWrap = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (pathname !== "/") {
      sessionStorage.setItem(PRELOADER_SESSION_KEY, "true");
    }
  }, [pathname]);

  // Open/close animation, driven by `open`.
  useIsomorphicLayoutEffect(() => {
    const el = overlay.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: open ? 1 : 0 });
      return;
    }

    const links = linksWrap.current?.querySelectorAll("li") ?? [];
    const ctx = gsap.context(() => {
      if (open) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .set(el, { autoAlpha: 1, pointerEvents: "auto" })
          .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7 })
          .from(links, { yPercent: 120, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.35");
      } else {
        gsap.to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
          ease: "expo.in",
          onComplete: () => gsap.set(el, { autoAlpha: 0, pointerEvents: "none" }),
        });
      }
    });
    return () => ctx.revert();
  }, [open]);

  // Lock body scroll while the menu is open.
  useIsomorphicLayoutEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (item: Item) => {
    setOpen(false);

    // Not on the home page → let the browser navigate to /#section.
    if (pathname !== "/") {
      router.push(item.hash ? `/#${item.hash}` : "/");
      return;
    }

    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number | string, o?: object) => void } }).lenis;
    const target = item.hash ? `#${item.hash}` : 0;
    // Wait for the close animation to release scroll-lock before scrolling.
    gsap.delayedCall(prefersReducedMotion() ? 0 : 0.35, () => {
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else if (typeof target === "string")
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <>
      {/* Top bar */}
      <header
        className={`fixed inset-x-0 top-0 flex items-center justify-between px-6 py-5 md:px-10 ${open ? "z-[71]" : "z-[60]"}`}
      >
        <button
          onClick={() => go({ label: "Home", hash: "" })}
          data-cursor
          aria-label="Home"
          className="font-display text-xl font-bold tracking-tight"
        >
          {initials || "PF"}
        </button>

        <div className="relative z-[71] flex items-center gap-3">
          <ThemeToggle size="sm" />
          <button
            onClick={() => setOpen((v) => !v)}
            data-cursor
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-[6px]"
          >
            <span
              className={`block h-[2px] w-7 bg-foreground transition-transform duration-300 ease-expo ${
                open ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-7 bg-foreground transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-7 bg-foreground transition-transform duration-300 ease-expo ${
                open ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      <div
        ref={overlay}
        className="invisible fixed inset-0 z-[70] flex items-center bg-background"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <nav className="mx-auto w-full max-w-content px-6 md:px-10">
          <ul ref={linksWrap} className="flex flex-col gap-2">
            {ITEMS.map((item, i) => (
              <li key={item.label} className="overflow-hidden">
                <button
                  onClick={() => go(item)}
                  data-cursor
                  className="font-display text-[clamp(2rem,8vw,7rem)] font-bold uppercase leading-[1.05] transition-colors hover:text-accent sm:text-huge"
                >
                  <span className="mr-4 align-top text-base text-muted">0{i + 1}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

/**
 * Single source of truth for GSAP.
 *
 * Register every plugin exactly ONCE here and import { gsap, ScrollTrigger, ... }
 * from this module everywhere else. Registering in multiple files causes
 * duplicate-registration warnings and subtle ScrollTrigger bugs.
 *
 * As of GSAP 3.13 every plugin (including the formerly paid SplitText) ships
 * free inside the core `gsap` package — no extra installs, no auth tokens.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Guard against double registration during Fast Refresh / RSC re-eval.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** True when the user has asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText };

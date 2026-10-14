"use client";

import { useLayoutEffect, useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * useLayoutEffect warns during SSR; swap to useEffect on the server so
 * GSAP setup stays warning-free while still running before paint on the client.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * useGsapContext — the safe way to run GSAP inside React.
 *
 * Wraps your animation setup in gsap.context() scoped to a container ref so
 * that:
 *   • every tween/ScrollTrigger created inside is tracked, and
 *   • ctx.revert() on unmount (or when a dep changes) kills them cleanly.
 *
 * Pass a `scope` ref to scope selector text (".foo") to that subtree.
 *
 * @example
 * const scope = useRef<HTMLDivElement>(null);
 * useGsapContext((ctx) => {
 *   gsap.from(".title", { y: 40, opacity: 0 });
 * }, scope);
 */
export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  scope?: RefObject<Element | null>,
  deps: unknown[] = []
) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      setupRef.current(self);
    }, scope?.current ?? undefined);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

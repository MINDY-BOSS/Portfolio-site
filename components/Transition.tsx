"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useCallback } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * TransitionLink — an internal link that plays a GSAP overlay "cover" wipe
 * BEFORE navigating. The new route's app/template.tsx then plays the matching
 * "reveal" (sliding the same-colour panel up), so navigation reads as one
 * continuous film rather than a hard cut.
 *
 * Use this for internal routes only (e.g. → /projects/aurora). External links
 * (GitHub/LinkedIn) should stay plain <a target="_blank">.
 */
export default function TransitionLink({
  href,
  children,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let modified clicks (open-in-new-tab etc.) behave natively.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();

      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }

      // A throwaway full-screen panel that covers the viewport, then hands off
      // to template.tsx's reveal once the new route mounts.
      const overlay = document.createElement("div");
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:95;background:var(--accent)";
      document.body.appendChild(overlay);

      // Slide up from below (100%) to fully covering (0), then hold.
      gsap.fromTo(
        overlay,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => {
            router.push(href);
            // template.tsx now owns the reveal; drop our temp panel behind it.
            gsap.delayedCall(0.25, () => overlay.remove());
          },
        }
      );
    },
    [href, router]
  );

  return (
    <a href={href} onClick={onClick} data-cursor className={className} {...rest}>
      {children}
    </a>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * MagneticButton — the button (and its label) drift toward the cursor while
 * hovered, then spring back on leave. Renders as an <a> so it works for the
 * GitHub/LinkedIn/resume links. External links get target/rel handled by caller.
 */
export default function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.4,
  ...rest
}: {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: relX * strength, y: relY * strength, duration: 0.6, ease: "power3" });
    gsap.to(label.current, { x: relX * strength * 0.35, y: relY * strength * 0.35, duration: 0.6, ease: "power3" });
  };

  const onLeave = () => {
    gsap.to([ref.current, label.current], {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
      className={`will-transform inline-flex items-center justify-center ${className}`}
      {...rest}
    >
      <span ref={label} className="will-transform inline-flex items-center gap-2">
        {children}
      </span>
    </a>
  );
}

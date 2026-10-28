"use client";

import { useEffect, useRef } from "react";
import { Particle } from "@/components/ui/particle-text-effect";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * HeroParticles — the particle-text effect, adapted as an ambient HERO
 * BACKGROUND. It reuses the physics from the shadcn `Particle` primitive but:
 *   • sizes its canvas to the parent (not a fixed 1000×500) and re-rasterises
 *     the text on resize, so it fills the hero on any screen;
 *   • recolours particles to the site palette (lime + off-white) instead of
 *     random colours;
 *   • is pointer-events:none so it never blocks the hero's buttons/cursor;
 *   • disables itself under prefers-reduced-motion (leaving a clean near-black
 *     background), matching the project's animation guardrails.
 */

// Site palette (see tailwind.config.ts): accent lime, off-white, dim lime.
const DARK_PALETTE = [
  { r: 231, g: 254, b: 85 },
  { r: 245, g: 245, b: 240 },
  { r: 176, g: 194, b: 60 },
];
const LIGHT_PALETTE = [
  { r: 38, g: 48, b: 19 },
  { r: 91, g: 113, b: 19 },
  { r: 102, g: 125, b: 10 },
];

function randomOffscreenPos(x: number, y: number, mag: number) {
  const dir = { x: Math.random() * 1000 - x, y: Math.random() * 500 - y };
  const m = Math.hypot(dir.x, dir.y) || 1;
  return { x: x + (dir.x / m) * mag, y: y + (dir.y / m) * mag };
}

export default function HeroParticles({ words }: { words: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const wordRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pixelSteps = 8; // sparser than the demo → lighter to render as a bg
    const particles = particlesRef.current;

    const sizeToParent = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };

    const pickColor = () => {
      const palette =
        document.documentElement.dataset.theme === "light"
          ? LIGHT_PALETTE
          : DARK_PALETTE;
      return palette[Math.floor(Math.random() * palette.length)];
    };

    const nextWord = (word: string) => {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d")!;

      // Scale the type to the canvas so it fills the hero and never clips.
      let fontSize = Math.max(44, Math.min(canvas.width * 0.13, canvas.height * 0.6));
      octx.font = `bold ${fontSize}px Arial`;
      const measured = octx.measureText(word).width;
      if (measured > canvas.width * 0.9) fontSize *= (canvas.width * 0.9) / measured;

      octx.fillStyle = "white";
      octx.font = `bold ${fontSize}px Arial`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(word, canvas.width / 2, canvas.height / 2);

      const pixels = octx.getImageData(0, 0, canvas.width, canvas.height).data;
      const newColor = pickColor();

      // Collect + shuffle target pixels for fluid motion.
      const coords: number[] = [];
      for (let i = 0; i < pixels.length; i += pixelSteps * 4) coords.push(i);
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }

      let idx = 0;
      for (const c of coords) {
        if (pixels[c + 3] > 0) {
          const x = (c / 4) % canvas.width;
          const y = Math.floor(c / 4 / canvas.width);

          let p: Particle;
          if (idx < particles.length) {
            p = particles[idx];
            p.isKilled = false;
            idx++;
          } else {
            p = new Particle();
            const start = randomOffscreenPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
            p.pos.x = start.x;
            p.pos.y = start.y;
            p.maxSpeed = Math.random() * 6 + 4;
            p.maxForce = p.maxSpeed * 0.05;
            p.particleSize = Math.random() * 6 + 6;
            p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
            particles.push(p);
          }

          p.startColor = {
            r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
            g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
            b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
          };
          p.targetColor = newColor;
          p.colorWeight = 0;
          p.target.x = x;
          p.target.y = y;
        }
      }
      // Retire any leftover particles from the previous (longer) word.
      for (let i = idx; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height);
    };

    const animate = () => {
      const ctx = canvas.getContext("2d")!;
      // Near-black trail fill → matches the page bg and leaves motion streaks.
      ctx.fillStyle =
        document.documentElement.dataset.theme === "light"
          ? "rgba(244, 246, 239, 0.2)"
          : "rgba(10, 10, 10, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.move();
        p.draw(ctx, true);
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
          particles.splice(i, 1);
        }
      }

      frameRef.current++;
      if (frameRef.current % 260 === 0) {
        wordRef.current = (wordRef.current + 1) % words.length;
        nextWord(words[wordRef.current]);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    sizeToParent();
    nextWord(words[0]);
    animate();

    const themeObserver = new MutationObserver(() => {
      nextWord(words[wordRef.current]);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Re-fit + re-rasterise on resize (debounced) so the bg never breaks.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sizeToParent();
        nextWord(words[wordRef.current]);
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      particlesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

"use client";

import { useState, useCallback } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsScroll from "@/components/ProjectsScroll";
import Skills from "@/components/Skills";
import CTA from "@/components/CTA";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const onDone = useCallback(() => {
    setLoaded(true);
    // Scroll was locked during the preloader, so pinned/scrubbed triggers were
    // measured against a frozen layout. Refresh once we're live so pinning and
    // horizontal-scroll distances are correct.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Preloader onDone={onDone} />
      <main>
        <Hero start={loaded} />
        <About />
        <ProjectsScroll />
        <Skills />
        <CTA />
      </main>
    </>
  );
}

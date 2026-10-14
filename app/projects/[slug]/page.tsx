import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/data/projects";
import TransitionLink from "@/components/Transition";

/**
 * /projects/[slug] — a lightweight case-study page for each project. Content
 * comes from /data/projects.ts, so adding a project automatically creates its
 * page. Statically generated at build time via generateStaticParams.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-content px-6 py-24 md:px-10 md:py-32">
      <TransitionLink
        href="/"
        className="mb-16 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
      >
        ← Back
      </TransitionLink>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-huge font-bold uppercase leading-none">
          {project.name}
        </h1>
        <span className="text-sm uppercase tracking-[0.2em] text-muted">
          {project.year}
        </span>
      </div>

      <p className="mt-8 max-w-2xl text-xl text-muted md:text-2xl">
        {project.description}
      </p>

      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
        <div>
          <span className="block text-muted">Role</span>
          <span>{project.role}</span>
        </div>
        <div>
          <span className="block text-muted">Stack</span>
          <span>{project.stack.join(" · ")}</span>
        </div>
      </div>

      <div className="mt-12 flex gap-3">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
        >
          View Live ↗
        </a>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
        >
          View Code ↗
        </a>
      </div>

      <div className="relative mt-16 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line">
        <Image
          src={project.image}
          alt={`${project.name} preview`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
    </main>
  );
}

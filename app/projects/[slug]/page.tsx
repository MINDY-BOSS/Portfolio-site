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
        {project.year && (
          <span className="text-sm uppercase tracking-[0.2em] text-muted">
            {project.year}
          </span>
        )}
      </div>

      <p className="mt-8 max-w-2xl text-xl text-muted md:text-2xl">
        {project.description}
      </p>

      {(project.role || project.stack?.length || project.stages?.length) && (
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
          {project.role && (
            <div>
              <span className="block text-muted">Role</span>
              <span>{project.role}</span>
            </div>
          )}
          {project.stack?.length ? (
            <div>
              <span className="block text-muted">Stack</span>
              <span>{project.stack.join(" · ")}</span>
            </div>
          ) : null}
          {project.stages?.length ? (
            <div>
              <span className="block text-muted">Stages</span>
              <span>{project.stages.join(" · ")}</span>
            </div>
          ) : null}
        </div>
      )}

      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-12 flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              View Live ↗
            </a>
          )}
          {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
          >
            View Code ↗
          </a>
          )}
        </div>
      )}

      <div className="image-light-frame relative isolate mt-16 aspect-[16/9] w-full rounded-2xl p-[2px]">
        <div className="absolute inset-[2px] overflow-hidden rounded-[14px]">
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}

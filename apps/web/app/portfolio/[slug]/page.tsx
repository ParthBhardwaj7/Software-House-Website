import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await api.get<Project>(`/projects/${encodeURIComponent(slug)}`);
    return {
      title: p.title,
      description: p.description.slice(0, 160),
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  let project: Project;
  try {
    project = await api.get<Project>(`/projects/${encodeURIComponent(slug)}`);
  } catch {
    notFound();
  }

  const stack = Array.isArray(project.techStack) ? project.techStack : [];

  return (
    <div className="page-marketing page-section-y w-full">
      <div className="page-container">
        <Link
          href="/portfolio"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to portfolio
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted lg:sticky lg:top-28">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No preview image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{project.category}</p>
            <h1 className="mt-2 font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {project.description}
            </p>

            {stack.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <Button asChild size="lg">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Visit live site
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Start a similar project</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

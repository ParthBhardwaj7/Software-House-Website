import { Metadata } from "next";
import Image from "next/image";
import { DUMMY_TEAM_MEMBERS } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the designers, engineers, and leads behind APN Codix — the team shipping your next product.",
};

export default function TeamsPage() {
  return (
    <div className="page-marketing page-section-y">
      <div className="page-wide">
        <h1 className="text-center font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl">
          Our Team
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          The people building products, design, and relationships at APN Codix.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DUMMY_TEAM_MEMBERS.map((m) => (
            <article
              key={m.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={m.imageUrl}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground">{m.name}</h2>
                <p className="text-sm font-medium text-primary">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

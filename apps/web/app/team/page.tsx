import { Metadata } from "next";
import Link from "next/link";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { getTeamMembers } from "@/lib/team";
export const metadata: Metadata = {
  title: "Team",
  description: "Meet the people behind your next build.",
};

export default async function TeamPage() {
  const members = await getTeamMembers();
  const isFallbackOnly =
    members.length > 0 &&
    members.every((m) => m.id.startsWith("dummy-"));

  return (
    <div className="page-marketing min-h-[min(100dvh,56rem)] w-full">
      <div className="page-container page-section-y">
        <div className="mb-10 max-w-2xl">
          <Link
            href="/contact"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Contact us
          </Link>
          <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-foreground md:text-5xl">
            Our team
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Designers, engineers, and leads — the people who ship with you from idea to launch.
          </p>
          {isFallbackOnly && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Showing sample profiles until your API returns live team data.
            </p>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((m) => (
            <TeamMemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { TeamMemberAvatar } from "@/components/team/TeamMemberAvatar";
import { cn } from "@/lib/utils";
import type { TeamMemberPublic } from "@/lib/team-types";

const BIO_PREVIEW = 160;

export function TeamMemberCard({ member }: { member: TeamMemberPublic }) {
  const [expanded, setExpanded] = useState(false);
  const bio = member.bio?.trim() || "";
  const long = bio.length > BIO_PREVIEW;
  const shown = expanded || !long ? bio : `${bio.slice(0, BIO_PREVIEW).trim()}…`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-[transform,box-shadow] duration-300 [motion-reduce:transition-none]",
        "hover:-translate-y-1 hover:shadow-xl [motion-reduce:hover]:translate-y-0"
      )}
    >
      <div className="relative flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <TeamMemberAvatar
            name={member.name}
            photoUrl={member.photoUrl}
            size="lg"
            overlapStyle={false}
            className="ring-2 ring-border"
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-xl font-semibold text-foreground" title={member.name}>
              {member.name}
            </h2>
            <p className="truncate text-sm font-medium text-primary" title={member.role}>
              {member.role}
            </p>
            {(member.linkedinUrl || member.githubUrl) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {member.linkedinUrl ? (
                  <Link
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/50 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
                {member.githubUrl ? (
                  <Link
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/50 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    aria-label={`${member.name} on GitHub`}
                  >
                    <Github className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>
        {bio ? (
          <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <p className="whitespace-pre-wrap">{shown}</p>
            {long && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="mt-2 text-sm font-semibold text-primary hover:underline"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm italic text-muted-foreground">Bio coming soon.</p>
        )}
      </div>
    </article>
  );
}

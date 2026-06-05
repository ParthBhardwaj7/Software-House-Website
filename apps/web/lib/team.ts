import { allowDummyMarketingContent } from "./allow-dummy-content";
import { DUMMY_TEAM } from "./team-fallback";
import type { TeamMemberPublic } from "./team-types";
import { getApiUrl } from "./get-api-url";

export type { TeamMemberPublic };

function teamFallback(): TeamMemberPublic[] {
  return allowDummyMarketingContent() ? DUMMY_TEAM : [];
}

/** Server-only: fetch team for SEO and LCP. Empty in production when API has no members. */
export async function getTeamMembers(): Promise<TeamMemberPublic[]> {
  try {
    const res = await fetch(`${getApiUrl()}/team-members`, {
      cache: "no-store",
    });
    if (!res.ok) return teamFallback();
    const data = (await res.json()) as TeamMemberPublic[];
    if (!Array.isArray(data) || data.length === 0) return teamFallback();
    return data;
  } catch {
    return teamFallback();
  }
}

import { DUMMY_TEAM } from "./team-fallback";
import type { TeamMemberPublic } from "./team-types";
import { getApiUrl } from "./get-api-url";

export type { TeamMemberPublic };

/** Server-only: fetch team for SEO and LCP. Falls back to DUMMY_TEAM on failure or empty. */
export async function getTeamMembers(): Promise<TeamMemberPublic[]> {
  try {
    const res = await fetch(`${getApiUrl()}/team-members`, {
      cache: "no-store",
    });
    if (!res.ok) return DUMMY_TEAM;
    const data = (await res.json()) as TeamMemberPublic[];
    if (!Array.isArray(data) || data.length === 0) return DUMMY_TEAM;
    return data;
  } catch {
    return DUMMY_TEAM;
  }
}

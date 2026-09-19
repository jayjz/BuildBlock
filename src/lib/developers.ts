import "server-only";
import { findDeveloper, type CuratedDeveloper } from "@/data/developers";
import { recordedDevelopers } from "@/data/fixtures";
import { normalizeActivities } from "@/lib/github/normalize";
import { githubEventSchema, githubProfileSchema, type GitHubEventFact, type GitHubProfileFact, type NormalizedActivity } from "@/lib/github/types";
import { deriveBlockState } from "@/lib/world/derive";

export type DeveloperExperience = { developer: CuratedDeveloper; profile: GitHubProfileFact; activities: NormalizedActivity[]; state: ReturnType<typeof deriveBlockState>; source: "live" | "recorded"; capturedAt: string };
const githubHeaders = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
class GitHubProfileNotFoundError extends Error {}

async function getLive(login: string) {
  const [profileResponse, eventResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${login}`, { headers: githubHeaders, next: { revalidate: 3600 } }),
    fetch(`https://api.github.com/users/${login}/events/public?per_page=100`, { headers: githubHeaders, next: { revalidate: 3600 } }),
  ]);
  if (profileResponse.status === 404) throw new GitHubProfileNotFoundError("GitHub profile was not found");
  if (!profileResponse.ok || !eventResponse.ok) throw new Error("GitHub public data is unavailable");
  return { profile: githubProfileSchema.parse(await profileResponse.json()), events: githubEventSchema.array().parse(await eventResponse.json()) };
}

export async function loadDeveloper(login: string): Promise<DeveloperExperience | null> {
  const developer = findDeveloper(login); if (!developer) return null;
  const recorded = recordedDevelopers[login];
  const mode = process.env.BUILDBLOCK_DATA_MODE;
  let source: "live" | "recorded" = "recorded";
  let profile = recorded.profile; let events: GitHubEventFact[] = recorded.events; let capturedAt = recorded.capturedAt;
  if (mode !== "recorded") {
    try {
      const live = await getLive(login); profile = live.profile; events = live.events; capturedAt = new Date().toISOString(); source = "live";
    } catch (error) {
      if (error instanceof GitHubProfileNotFoundError) return null;
      /* transient live-source failures leave the explicit recorded source visible */
    }
  }
  const activities = normalizeActivities(events, developer.id);
  return { developer, profile, activities, state: deriveBlockState(activities, capturedAt), source, capturedAt };
}

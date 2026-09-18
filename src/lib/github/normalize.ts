import type { GitHubEventFact, NormalizedActivity } from "./types";

const repositoryUrl = (name: string) => `https://github.com/${name}`;

export function normalizeActivities(events: GitHubEventFact[], developerId: number): NormalizedActivity[] {
  const accepted = events
    .filter((event) => event.public && event.actor.id === developerId)
    .flatMap((event): NormalizedActivity[] => {
      const base = { developerId, login: event.actor.login, repository: event.repo, occurredAt: event.created_at, sourceEventIds: [event.id] };
      if (event.type === "PushEvent" && event.payload.head) return [{ ...base, id: `push:${event.repo.id}:${event.payload.head}`, kind: "code_pushed", evidenceUrl: `${repositoryUrl(event.repo.name)}/commit/${event.payload.head}` }];
      if (event.type === "PullRequestEvent" && event.payload.number) {
        const url = event.payload.pull_request?.html_url ?? `${repositoryUrl(event.repo.name)}/pull/${event.payload.number}`;
        if (event.payload.action === "opened") return [{ ...base, id: `pr-opened:${event.repo.id}:${event.payload.number}`, kind: "pull_request_opened", evidenceUrl: url }];
        if (event.payload.action === "merged" || (event.payload.action === "closed" && event.payload.pull_request?.merged === true)) return [{ ...base, id: `pr-merged:${event.repo.id}:${event.payload.number}`, kind: "pull_request_merged", evidenceUrl: url }];
      }
      if (event.type === "ReleaseEvent" && event.payload.action === "published" && event.payload.release?.id) return [{ ...base, id: `release:${event.repo.id}:${event.payload.release.id}`, kind: "release_published", evidenceUrl: event.payload.release.html_url ?? repositoryUrl(event.repo.name) }];
      return [];
    });
  return [...new Map(accepted.map((activity) => [activity.id, activity])).values()].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt) || a.id.localeCompare(b.id));
}

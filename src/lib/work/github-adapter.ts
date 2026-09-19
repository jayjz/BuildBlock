import type { NormalizedActivity } from "@/lib/github/types";
import { canonicalizeObservations } from "./canonicalize.ts";
import type { CanonicalWorkResult, WorkObservation } from "./types.ts";

const map = { code_pushed: "artifact_changed", pull_request_opened: "change_proposed", pull_request_merged: "change_integrated", release_published: "artifact_published" } as const;

export function adaptGitHubActivities(activities: NormalizedActivity[], observedAt: string): CanonicalWorkResult {
  const observations = activities.map((activity): WorkObservation => {
    const kind = map[activity.kind];
    const base = { schemaVersion: "work-observation-v1" as const, id: `github:${activity.id}`, actor: { id: `github-user:${activity.developerId}`, label: activity.login }, reporter: { id: "github:public-events" }, repository: { id: `github-repository:${activity.repository.id}`, name: activity.repository.name }, occurredAt: activity.occurredAt, observedAt, provenance: { source: "github" as const, sourceFactId: `github-event:${activity.sourceEventIds[0]}` }, evidence: [{ reference: activity.evidenceUrl }] };
    if (kind === "artifact_changed") return { ...base, kind, body: { normalizedActivityId: `github:${activity.id}`, evidenceUrl: activity.evidenceUrl } };
    return { ...base, kind, body: { normalizedActivityId: `github:${activity.id}`, evidenceUrl: activity.evidenceUrl } };
  });
  return canonicalizeObservations(observations);
}

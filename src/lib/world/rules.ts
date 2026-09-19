import type { NormalizedActivity } from "@/lib/github/types";
import type { WorldEvent } from "./types";

export function deriveWorldEvents(activities: NormalizedActivity[]): WorldEvent[] {
  return activities.flatMap((activity) => {
    const events: WorldEvent[] = [{ id: `workday:${activity.id}`, kind: "workday_observed", effectiveAt: activity.occurredAt, activity }];
    if (activity.kind === "pull_request_merged") events.push({ id: `merge:${activity.id}`, kind: "merge_observed", effectiveAt: activity.occurredAt, activity });
    if (activity.kind === "release_published") events.push({ id: `release:${activity.id}`, kind: "release_observed", effectiveAt: activity.occurredAt, activity });
    return events;
  });
}

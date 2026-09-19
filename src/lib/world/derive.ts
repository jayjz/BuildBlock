import type { NormalizedActivity } from "@/lib/github/types";
import { deriveWorldEvents } from "./rules";
import type { BlockState, ObservedRepository } from "./types";

const dayKey = (value: string) => value.slice(0, 10);

function compareActivities(a: NormalizedActivity, b: NormalizedActivity) {
  return b.occurredAt.localeCompare(a.occurredAt) || a.id.localeCompare(b.id);
}

function deriveRepositories(activities: NormalizedActivity[]): ObservedRepository[] {
  const byRepository = new Map<number, NormalizedActivity[]>();
  for (const activity of activities) {
    const grouped = byRepository.get(activity.repository.id) ?? [];
    grouped.push(activity);
    byRepository.set(activity.repository.id, grouped);
  }

  return [...byRepository.entries()]
    .map(([id, grouped]) => {
      const sorted = [...grouped].sort(compareActivities);
      const latest = sorted[0]!;
      return {
        repository: { id, name: latest.repository.name },
        activities: sorted,
        latestObservedAt: latest.occurredAt,
        hasMerge: sorted.some((activity) => activity.kind === "pull_request_merged"),
        hasRelease: sorted.some((activity) => activity.kind === "release_published"),
      };
    })
    .sort((a, b) => b.latestObservedAt.localeCompare(a.latestObservedAt) || a.repository.id - b.repository.id);
}

export function deriveBlockState(activities: NormalizedActivity[], asOf: string): BlockState {
  const end = new Date(asOf); end.setUTCHours(0, 0, 0, 0);
  const startsAt = new Date(end.getTime() - 6 * 86_400_000).toISOString();
  const days = Array.from({ length: 7 }, (_, index) => new Date(end.getTime() - (6 - index) * 86_400_000).toISOString().slice(0, 10));
  const eligible = activities.filter((activity) => activity.occurredAt <= asOf && days.includes(dayKey(activity.occurredAt)));
  const events = deriveWorldEvents(eligible);
  const merges = events.filter((event) => event.kind === "merge_observed");
  const releases = events.filter((event) => event.kind === "release_observed");
  return { ruleVersion: "p0-v1", asOf, observationWindow: { startsAt, endsAt: asOf }, windows: days.map((day) => eligible.some((activity) => dayKey(activity.occurredAt) === day)), repositories: deriveRepositories(eligible), mergeEvents: merges, releaseEvents: releases,
    explanations: [
      ...merges.map((event) => `Merge pennant: observed merge in ${event.activity.repository.name}.`),
      ...releases.map((event) => `Release beacon: observed release in ${event.activity.repository.name}.`),
    ] };
}

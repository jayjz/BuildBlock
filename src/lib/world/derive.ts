import type { NormalizedActivity } from "@/lib/github/types";
import { deriveWorldEvents } from "./rules";
import type { BlockState } from "./types";

const dayKey = (value: string) => value.slice(0, 10);
export function deriveBlockState(activities: NormalizedActivity[], asOf: string): BlockState {
  const end = new Date(asOf); end.setUTCHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, index) => new Date(end.getTime() - (6 - index) * 86_400_000).toISOString().slice(0, 10));
  const eligible = activities.filter((activity) => activity.occurredAt <= asOf && days.includes(dayKey(activity.occurredAt)));
  const events = deriveWorldEvents(eligible);
  const merges = events.filter((event) => event.kind === "merge_observed");
  const releases = events.filter((event) => event.kind === "release_observed");
  return { ruleVersion: "p0-v1", asOf, windows: days.map((day) => eligible.some((activity) => dayKey(activity.occurredAt) === day)), mergeEvents: merges, releaseEvents: releases,
    explanations: [
      ...merges.map((event) => `Merge pennant: observed merge in ${event.activity.repository.name}.`),
      ...releases.map((event) => `Release beacon: observed release in ${event.activity.repository.name}.`),
    ] };
}

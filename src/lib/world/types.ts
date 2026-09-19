import type { NormalizedActivity } from "@/lib/github/types";

export type WorldEvent = { id: string; kind: "workday_observed" | "merge_observed" | "release_observed"; effectiveAt: string; activity: NormalizedActivity };
export type ObservedRepository = {
  repository: { id: number; name: string };
  activities: NormalizedActivity[];
  latestObservedAt: string;
  hasMerge: boolean;
  hasRelease: boolean;
};

export type BlockState = {
  ruleVersion: "p0-v1";
  asOf: string;
  observationWindow: { startsAt: string; endsAt: string };
  windows: boolean[];
  repositories: ObservedRepository[];
  mergeEvents: WorldEvent[];
  releaseEvents: WorldEvent[];
  explanations: string[];
};

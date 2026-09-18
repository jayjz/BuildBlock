import type { NormalizedActivity } from "@/lib/github/types";

export type WorldEvent = { id: string; kind: "workday_observed" | "merge_observed" | "release_observed"; effectiveAt: string; activity: NormalizedActivity };
export type BlockState = { ruleVersion: "p0-v1"; asOf: string; windows: boolean[]; mergeEvents: WorldEvent[]; releaseEvents: WorldEvent[]; explanations: string[] };

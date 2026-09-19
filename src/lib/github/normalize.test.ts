import { describe, expect, it } from "vitest";
import { normalizeActivities } from "./normalize";
import type { GitHubEventFact } from "./types";

const event = (overrides: Partial<GitHubEventFact> = {}): GitHubEventFact => ({ id: "1", type: "PushEvent", actor: { id: 7, login: "dev" }, repo: { id: 9, name: "dev/repo" }, created_at: "2026-09-17T12:00:00.000Z", public: true, payload: { head: "abc" }, ...overrides });
describe("normalizeActivities", () => { it("deduplicates pushes and attributes actor IDs", () => { const push = event(); expect(normalizeActivities([push, { ...push, id: "2" }, event({ actor: { id: 8, login: "other" } })], 7)).toHaveLength(1); }); it("accepts merged but not merely closed pull requests", () => { const closed = event({ type: "PullRequestEvent", payload: { action: "closed", number: 4, pull_request: { merged: false } } }); const merged = event({ id: "3", type: "PullRequestEvent", payload: { action: "merged", number: 4, pull_request: {} } }); expect(normalizeActivities([closed, merged], 7).map((item) => item.kind)).toEqual(["pull_request_merged"]); }); it("excludes unsupported events", () => expect(normalizeActivities([event({ type: "WatchEvent", payload: {} })], 7)).toEqual([])); });

describe("important normalized activity facts", () => {
  it("maps releases and merges to durable evidence URLs", () => {
    const release = event({ id: "release-event", type: "ReleaseEvent", payload: { action: "published", release: { id: 12, html_url: "https://github.com/dev/repo/releases/tag/v1" } } });
    const merge = event({ id: "merge-event", type: "PullRequestEvent", payload: { action: "merged", number: 4, pull_request: { html_url: "https://github.com/dev/repo/pull/4" } } });
    expect(normalizeActivities([release, merge], 7)).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "release_published", id: "release:9:12", evidenceUrl: "https://github.com/dev/repo/releases/tag/v1" }),
      expect.objectContaining({ kind: "pull_request_merged", id: "pr-merged:9:4", evidenceUrl: "https://github.com/dev/repo/pull/4" }),
    ]));
  });

  it("selects duplicate representations independently of input order", () => {
    const earlier = event({ id: "z-event", created_at: "2026-09-17T12:00:00.000Z" });
    const later = event({ id: "a-event", created_at: "2026-09-17T13:00:00.000Z" });
    expect(normalizeActivities([earlier, later], 7)).toEqual(normalizeActivities([later, earlier], 7));
    expect(normalizeActivities([earlier, later], 7)[0]?.occurredAt).toBe("2026-09-17T12:00:00.000Z");
  });

  it("excludes private and wrong-actor events", () => {
    expect(normalizeActivities([event({ public: false }), event({ actor: { id: 8, login: "other" } })], 7)).toEqual([]);
  });
});

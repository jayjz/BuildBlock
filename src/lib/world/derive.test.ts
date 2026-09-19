import { describe, expect, it } from "vitest";
import { deriveBlockState } from "./derive";
import type { NormalizedActivity } from "@/lib/github/types";
import { normalizeActivities } from "@/lib/github/normalize";
import { recordedDevelopers } from "@/data/fixtures";
const asOf = "2026-09-17T23:30:00.000Z";
const activity = (occurredAt: string, id = occurredAt, repository = { id: 2, name: "dev/repo" }, kind: NormalizedActivity["kind"] = "code_pushed"): NormalizedActivity => ({ id, kind, developerId: 1, login: "dev", repository, occurredAt, evidenceUrl: `https://github.com/${repository.name}`, sourceEventIds: [id] });
describe("deriveBlockState", () => { it("uses exact UTC observation boundaries and stable identity-free state", () => { const state = deriveBlockState([activity("2026-09-11T00:00:00.000Z"), activity("2026-09-17T23:00:00.000Z"), activity("2026-09-10T23:59:59.000Z")], "2026-09-17T23:30:00.000Z"); expect(state.windows).toEqual([true, false, false, false, false, false, true]); }); });

describe("deriveBlockState signals", () => {
  it("derives merge pennants and release beacons from normalized activity", () => {
    const merged = { ...activity("2026-09-17T10:00:00.000Z", "merge"), kind: "pull_request_merged" as const };
    const released = { ...activity("2026-09-16T10:00:00.000Z", "release"), kind: "release_published" as const };
    const state = deriveBlockState([merged, released], "2026-09-17T23:30:00.000Z");
    expect(state.mergeEvents).toHaveLength(1);
    expect(state.releaseEvents).toHaveLength(1);
  });

  it("excludes future activity from the observation window", () => {
    const state = deriveBlockState([activity("2026-09-18T00:00:00.000Z")], "2026-09-17T23:30:00.000Z");
    expect(state.windows).toEqual([false, false, false, false, false, false, false]);
  });
});

describe("observed repository groups", () => {
  it("returns zero groups when there is no eligible observed work", () => {
    expect(deriveBlockState([activity("2026-09-10T23:59:59.000Z"), activity("2026-09-18T00:00:00.000Z")], asOf).repositories).toEqual([]);
  });

  it("groups one repository and retains its eligible activities", () => {
    const state = deriveBlockState([activity("2026-09-17T12:00:00.000Z", "a"), activity("2026-09-16T12:00:00.000Z", "b")], asOf);
    expect(state.repositories).toHaveLength(1);
    expect(state.repositories[0]).toMatchObject({ repository: { id: 2, name: "dev/repo" }, latestObservedAt: "2026-09-17T12:00:00.000Z" });
    expect(state.repositories[0]?.activities.map((item) => item.id)).toEqual(["a", "b"]);
  });

  it("keeps three and more than three repositories in domain state", () => {
    const repositories = [1, 2, 3, 4].map((id) => activity(`2026-09-17T0${id}:00:00.000Z`, `repo-${id}`, { id, name: `dev/repo-${id}` }));
    expect(deriveBlockState(repositories.slice(0, 3), asOf).repositories).toHaveLength(3);
    expect(deriveBlockState(repositories, asOf).repositories).toHaveLength(4);
  });

  it("orders groups by their newest eligible observation then repository ID", () => {
    const state = deriveBlockState([
      activity("2026-09-16T12:00:00.000Z", "older", { id: 9, name: "dev/older" }),
      activity("2026-09-17T12:00:00.000Z", "high", { id: 7, name: "dev/high" }),
      activity("2026-09-17T12:00:00.000Z", "low", { id: 3, name: "dev/low" }),
    ], asOf);
    expect(state.repositories.map((group) => group.repository.id)).toEqual([3, 7, 9]);
  });

  it("is identical when eligible input is reordered", () => {
    const input = [
      activity("2026-09-17T11:00:00.000Z", "b", { id: 5, name: "dev/five" }),
      activity("2026-09-17T12:00:00.000Z", "a", { id: 3, name: "dev/three" }, "pull_request_merged"),
      activity("2026-09-16T12:00:00.000Z", "c", { id: 5, name: "dev/five" }, "release_published"),
    ];
    expect(deriveBlockState(input, asOf).repositories).toEqual(deriveBlockState([...input].reverse(), asOf).repositories);
  });

  it("attributes merge and release state to the individual repository and allows both", () => {
    const state = deriveBlockState([
      activity("2026-09-17T12:00:00.000Z", "merge", { id: 1, name: "dev/one" }, "pull_request_merged"),
      activity("2026-09-17T11:00:00.000Z", "release", { id: 1, name: "dev/one" }, "release_published"),
      activity("2026-09-17T10:00:00.000Z", "other", { id: 2, name: "dev/two" }, "release_published"),
    ], asOf);
    expect(state.repositories[0]).toMatchObject({ repository: { id: 1 }, hasMerge: true, hasRelease: true });
    expect(state.repositories[1]).toMatchObject({ repository: { id: 2 }, hasMerge: false, hasRelease: true });
  });

  it("keeps opened pull requests as observed work without merge state", () => {
    const state = deriveBlockState([activity("2026-09-17T12:00:00.000Z", "opened", { id: 1, name: "dev/one" }, "pull_request_opened")], asOf);
    expect(state.repositories[0]).toMatchObject({ hasMerge: false, hasRelease: false });
    expect(state.repositories[0]?.activities).toHaveLength(1);
  });

  it("uses boolean merge and release semantics for repeated same-kind events", () => {
    const state = deriveBlockState([
      activity("2026-09-17T12:00:00.000Z", "merge-1", { id: 1, name: "dev/one" }, "pull_request_merged"),
      activity("2026-09-17T11:00:00.000Z", "merge-2", { id: 1, name: "dev/one" }, "pull_request_merged"),
      activity("2026-09-17T10:00:00.000Z", "release-1", { id: 1, name: "dev/one" }, "release_published"),
      activity("2026-09-17T09:00:00.000Z", "release-2", { id: 1, name: "dev/one" }, "release_published"),
    ], asOf);
    expect(state.repositories[0]).toMatchObject({ hasMerge: true, hasRelease: true });
  });

  it("resolves a repository name from the newest activity and activity ID on timestamp ties", () => {
    const state = deriveBlockState([
      activity("2026-09-17T12:00:00.000Z", "z", { id: 1, name: "dev/older-name" }),
      activity("2026-09-17T12:00:00.000Z", "a", { id: 1, name: "dev/resolved-name" }),
      activity("2026-09-16T12:00:00.000Z", "newer-by-date", { id: 1, name: "dev/not-current" }),
    ], asOf);
    expect(state.repositories[0]?.repository.name).toBe("dev/resolved-name");
  });

  it("preserves the recorded-mode repository frontage without fabricating release state", () => {
    const stateFor = (login: keyof typeof recordedDevelopers) => {
      const recorded = recordedDevelopers[login];
      return deriveBlockState(normalizeActivities(recorded.events, recorded.profile.id), recorded.capturedAt);
    };
    const jayjz = stateFor("jayjz");
    expect(jayjz.repositories.map((group) => group.repository.name)).toEqual(["jayjz/TEMPER", "jayjz/jayjz"]);
    expect(jayjz.repositories.find((group) => group.repository.name === "jayjz/TEMPER")).toMatchObject({ hasMerge: true, hasRelease: false });
    expect(stateFor("antfu").repositories).toHaveLength(2);
    expect(stateFor("shuding").repositories).toHaveLength(1);
    expect([...jayjz.repositories, ...stateFor("antfu").repositories, ...stateFor("shuding").repositories].some((group) => group.hasRelease)).toBe(false);
  });
});

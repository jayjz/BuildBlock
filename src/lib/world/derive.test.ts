import { describe, expect, it } from "vitest";
import { deriveBlockState } from "./derive";
import type { NormalizedActivity } from "@/lib/github/types";
const activity = (occurredAt: string, id = occurredAt): NormalizedActivity => ({ id, kind: "code_pushed", developerId: 1, login: "dev", repository: { id: 2, name: "dev/repo" }, occurredAt, evidenceUrl: "https://github.com/dev/repo", sourceEventIds: [id] });
describe("deriveBlockState", () => { it("uses exact UTC observation boundaries and stable identity-free state", () => { const state = deriveBlockState([activity("2026-09-11T00:00:00.000Z"), activity("2026-09-17T23:00:00.000Z"), activity("2026-09-10T23:59:59.000Z")], "2026-09-17T23:30:00.000Z"); expect(state.windows).toEqual([true, false, false, false, false, false, true]); }); });

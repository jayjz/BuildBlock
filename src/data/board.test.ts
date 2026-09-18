import { describe, expect, it } from "vitest";
import { boardSpaces } from "./board";
describe("board topology", () => { it("has 40 stable spaces and configured developer addresses", () => { expect(boardSpaces).toHaveLength(40); expect(new Set(boardSpaces.map((space) => space.index)).size).toBe(40); expect(boardSpaces.filter((space) => space.kind === "developer").map((space) => space.index)).toEqual([1, 5, 11]); }); });

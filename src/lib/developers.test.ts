import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { loadDeveloper } from "./developers";

describe("loadDeveloper live-source failures", () => {
  it("does not present a recorded profile for a definitive 404", async () => {
    vi.stubEnv("BUILDBLOCK_DATA_MODE", "live");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 404 })));
    await expect(loadDeveloper("jayjz")).resolves.toBeNull();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("uses the explicit recorded source for transient upstream failure", async () => {
    vi.stubEnv("BUILDBLOCK_DATA_MODE", "live");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 503 })));
    await expect(loadDeveloper("jayjz")).resolves.toMatchObject({ source: "recorded" });
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
});

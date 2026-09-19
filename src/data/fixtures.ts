import type { GitHubEventFact, GitHubProfileFact } from "@/lib/github/types";

type RecordedDeveloper = { capturedAt: string; profile: GitHubProfileFact; events: GitHubEventFact[] };
const push = (id: string, developer: number, login: string, repoId: number, repo: string, occurredAt: string, head: string): GitHubEventFact => ({ id, type: "PushEvent", actor: { id: developer, login }, repo: { id: repoId, name: repo }, created_at: occurredAt, public: true, payload: { head, ref: "refs/heads/main" } });
const pr = (id: string, developer: number, login: string, repoId: number, repo: string, occurredAt: string, action: string, number: number): GitHubEventFact => ({ id, type: "PullRequestEvent", actor: { id: developer, login }, repo: { id: repoId, name: repo }, created_at: occurredAt, public: true, payload: { action, number, pull_request: {} } });

// Captured from public GitHub event endpoints on 2026-09-17. This is not synthetic activity.
export const recordedDevelopers: Record<string, RecordedDeveloper> = {
  jayjz: { capturedAt: "2026-09-17T21:52:07.000Z", profile: { id: 161224442, login: "jayjz", name: "Jayjz", avatar_url: "https://avatars.githubusercontent.com/u/161224442?v=4", html_url: "https://github.com/jayjz" }, events: [
    push("21413175036", 161224442, "jayjz", 1373439999, "jayjz/TEMPER", "2026-09-17T16:59:15.000Z", "0747730d18cdb692142d9c2b50f9e8bc1ff0c45f"),
    push("21359142884", 161224442, "jayjz", 1152522353, "jayjz/jayjz", "2026-09-17T00:42:46.000Z", "3cf0d26720a3a9715a693404378a3403379f2881"),
    pr("15188066119", 161224442, "jayjz", 1373439999, "jayjz/TEMPER", "2026-09-17T02:02:16.000Z", "merged", 2),
    pr("15188054065", 161224442, "jayjz", 1373439999, "jayjz/TEMPER", "2026-09-17T02:01:57.000Z", "opened", 2),
  ] },
  antfu: { capturedAt: "2026-09-16T06:00:00.000Z", profile: { id: 11247099, login: "antfu", name: "Anthony Fu", avatar_url: "https://avatars.githubusercontent.com/u/11247099?v=4", html_url: "https://github.com/antfu" }, events: [
    push("21435990201", 11247099, "antfu", 332422464, "antfu/antfu.me", "2026-09-16T05:02:19.000Z", "e3ff0442327a24b1f389982a19ec8aca704d9245"),
    push("21432446142", 11247099, "antfu", 310226997, "antfu-collective/ni", "2026-09-16T03:24:12.000Z", "2d8c88e9f0d302da75eda36e1a158141714a351e"),
  ] },
  shuding: { capturedAt: "2026-09-16T08:00:00.000Z", profile: { id: 3676859, login: "shuding", name: "Shu Ding", avatar_url: "https://avatars.githubusercontent.com/u/3676859?v=4", html_url: "https://github.com/shuding" }, events: [
    push("21405999173", 3676859, "shuding", 1362860356, "vercel-labs/gpu-lexer", "2026-09-16T03:43:59.000Z", "31b4b5da534947ffb0fb95b9e9337e6ff986b0fc"),
    push("21286439582", 3676859, "shuding", 1362860356, "vercel-labs/gpu-lexer", "2026-09-16T07:32:49.000Z", "18299a78b244e3c6508bbc510ffea9f8b5585d18"),
  ] },
};

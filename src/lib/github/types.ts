import { z } from "zod";

const actorSchema = z.object({ id: z.number(), login: z.string() });
const repositorySchema = z.object({ id: z.number(), name: z.string() });

export const githubProfileSchema = z.object({
  id: z.number(), login: z.string(), name: z.string().nullable(), avatar_url: z.string().url(), html_url: z.string().url(),
});

export const githubEventSchema = z.object({
  id: z.string(), type: z.string(), actor: actorSchema, repo: repositorySchema, created_at: z.string().datetime(), public: z.boolean().optional().default(true),
  payload: z.object({
    head: z.string().optional(), ref: z.string().optional(), action: z.string().optional(), number: z.number().optional(),
    pull_request: z.object({ merged: z.boolean().nullable().optional(), html_url: z.string().url().nullable().optional() }).optional(),
    release: z.object({ id: z.number().optional(), html_url: z.string().url().nullable().optional() }).optional(),
  }).passthrough(),
}).passthrough();

export type GitHubProfileFact = z.infer<typeof githubProfileSchema>;
export type GitHubEventFact = z.infer<typeof githubEventSchema>;
export type ActivityKind = "code_pushed" | "pull_request_opened" | "pull_request_merged" | "release_published";

export type NormalizedActivity = {
  id: string; kind: ActivityKind; developerId: number; login: string; repository: { id: number; name: string };
  occurredAt: string; evidenceUrl: string; sourceEventIds: string[];
};

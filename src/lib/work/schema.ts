import { z } from "zod";
import { localRunBundleSchemaVersion, workObservationSchemaVersion } from "./types.ts";

const namespacedId = z.string().regex(/^[a-z][a-z0-9-]*:[^\s]+$/, "must be a namespaced identity");
const timestamp = z.string().datetime();
const identity = z.object({ id: namespacedId, label: z.string().min(1).optional() }).strict();
const repository = z.object({ id: namespacedId, name: z.string().min(1) }).strict();
const evidence = z.object({ path: z.string().min(1).optional(), sha256: z.string().regex(/^[a-f0-9]{64}$/).optional(), reference: z.string().min(1) }).strict();
const base = z.object({
  schemaVersion: z.literal(workObservationSchemaVersion), id: namespacedId, actor: identity, reporter: identity, run: identity.optional(), repository,
  occurredAt: timestamp, observedAt: timestamp, provenance: z.object({ source: z.enum(["github", "local-run"]), sourceFactId: namespacedId, collector: z.string().min(1).optional() }).strict(), evidence: z.array(evidence).min(1),
});

export const workObservationSchema = z.discriminatedUnion("kind", [
  base.extend({ kind: z.literal("run_started"), body: z.object({ runId: namespacedId }).strict() }),
  base.extend({ kind: z.literal("artifact_changed"), body: z.union([z.object({ before: z.object({ revision: z.string().min(1) }).strict(), after: z.object({ revision: z.string().min(1) }).strict(), patchEvidence: z.string().min(1) }).strict(), z.object({ normalizedActivityId: namespacedId, evidenceUrl: z.string().url() }).strict()]) }),
  base.extend({ kind: z.literal("verification_finished"), body: z.object({ executionId: namespacedId, checkKey: z.string().min(1), revision: z.string().min(1), startedAt: timestamp, finishedAt: timestamp, outcome: z.enum(["passed", "failed", "error", "cancelled"]), executionEvidence: z.string().min(1) }).strict() }),
  base.extend({ kind: z.literal("run_finished"), body: z.object({ outcome: z.enum(["completed", "blocked", "aborted"]) }).strict() }),
  base.extend({ kind: z.literal("change_proposed"), body: z.object({ normalizedActivityId: namespacedId, evidenceUrl: z.string().url() }).strict() }),
  base.extend({ kind: z.literal("change_integrated"), body: z.object({ normalizedActivityId: namespacedId, evidenceUrl: z.string().url() }).strict() }),
  base.extend({ kind: z.literal("artifact_published"), body: z.object({ normalizedActivityId: namespacedId, evidenceUrl: z.string().url() }).strict() }),
]);

const factBase = z.object({ id: namespacedId, occurredAt: timestamp, observedAt: timestamp, evidence: z.array(evidence).min(1) });
export const localRunBundleSchema = z.object({
  schemaVersion: z.literal(localRunBundleSchemaVersion), sourceInstance: namespacedId, repository, run: identity, actor: identity, reporter: identity,
  facts: z.array(z.discriminatedUnion("kind", [
    factBase.extend({ kind: z.literal("session.started"), baselineRevision: z.string().min(1), worktreeClean: z.boolean() }),
    factBase.extend({ kind: z.literal("worktree.captured"), beforeRevision: z.string().min(1), afterRevision: z.string().min(1), patchEvidence: z.string().min(1) }),
    factBase.extend({ kind: z.literal("command.finished"), executionId: namespacedId, checkKey: z.string().min(1), revision: z.string().min(1), startedAt: timestamp, finishedAt: timestamp, outcome: z.enum(["passed", "failed", "error", "cancelled"]), executionEvidence: z.string().min(1) }),
    factBase.extend({ kind: z.literal("session.finished"), outcome: z.enum(["completed", "blocked", "aborted"]) }),
  ])).min(1),
}).strict();

export type LocalRunBundle = z.infer<typeof localRunBundleSchema>;

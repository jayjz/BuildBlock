import { createHash } from "node:crypto";
import { realpathSync, readFileSync, lstatSync } from "node:fs";
import { resolve, sep } from "node:path";
import { canonicalizeObservations } from "./canonicalize.ts";
import { localRunBundleSchema, type LocalRunBundle } from "./schema.ts";
import type { CanonicalWorkResult, SupportingEvidence, WorkDiagnostic, WorkObservation } from "./types.ts";

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
function evidenceAt(root: string, evidence: SupportingEvidence): WorkDiagnostic | undefined {
  if (!evidence.path || !evidence.sha256) return { code: "invalid_evidence", message: `Local evidence ${evidence.reference} requires path and SHA-256.` };
  if (evidence.path.includes("\\") || evidence.path.split("/").includes("..") || evidence.path.startsWith("/")) return { code: "unsafe_evidence_path", message: `Rejected evidence path ${evidence.path}.` };
  const target = resolve(root, evidence.path); const rootReal = realpathSync(root); let targetReal: string;
  try { if (lstatSync(target).isSymbolicLink()) return { code: "escaping_symlink", message: `Rejected symlink evidence ${evidence.path}.` }; targetReal = realpathSync(target); } catch { return { code: "missing_evidence", message: `Missing evidence ${evidence.path}.` }; }
  if (targetReal !== rootReal && !targetReal.startsWith(`${rootReal}${sep}`)) return { code: "escaping_symlink", message: `Evidence escapes bundle root: ${evidence.path}.` };
  if (sha256(targetReal) !== evidence.sha256) return { code: "bad_evidence_digest", message: `SHA-256 mismatch for ${evidence.path}.` };
  return undefined;
}

export function loadLocalRunBundle(root: string): { bundle?: LocalRunBundle; diagnostics: WorkDiagnostic[] } {
  const diagnostics: WorkDiagnostic[] = []; const manifestPath = resolve(root, "manifest.json"); let raw: unknown;
  try { raw = JSON.parse(readFileSync(manifestPath, "utf8")); } catch { return { diagnostics: [{ code: "invalid_manifest", message: "Missing or invalid manifest.json." }] }; }
  const parsed = localRunBundleSchema.safeParse(raw);
  if (!parsed.success) return { diagnostics: [{ code: "invalid_manifest", message: parsed.error.issues.map((issue) => issue.message).join("; ") }] };
  for (const fact of parsed.data.facts) for (const item of fact.evidence) { const problem = evidenceAt(root, item); if (problem) diagnostics.push({ ...problem, sourceFactId: fact.id }); }
  return diagnostics.length ? { diagnostics } : { bundle: parsed.data, diagnostics };
}

export function adaptLocalRunBundle(bundle: LocalRunBundle): CanonicalWorkResult {
  const observations: WorkObservation[] = []; const diagnostics: WorkDiagnostic[] = [];
  for (const fact of bundle.facts) {
    const base = { schemaVersion: "work-observation-v1" as const, id: `local-run:${fact.id}`, actor: bundle.actor, reporter: bundle.reporter, run: bundle.run, repository: bundle.repository, occurredAt: fact.occurredAt, observedAt: fact.observedAt, provenance: { source: "local-run" as const, sourceFactId: fact.id, collector: bundle.reporter.id }, evidence: fact.evidence };
    if (fact.kind === "session.started") observations.push({ ...base, kind: "run_started", body: { runId: bundle.run.id } });
    if (fact.kind === "worktree.captured") observations.push({ ...base, kind: "artifact_changed", body: { before: { revision: fact.beforeRevision }, after: { revision: fact.afterRevision }, patchEvidence: fact.patchEvidence } });
    if (fact.kind === "command.finished") {
      const hasExactArtifact = bundle.facts.some((candidate) => candidate.kind === "worktree.captured" && candidate.afterRevision === fact.revision);
      if (!hasExactArtifact) diagnostics.push({ code: "unbound_verification", message: `Verification ${fact.executionId} was not bound to a captured artifact revision.`, sourceFactId: fact.id });
      else observations.push({ ...base, kind: "verification_finished", body: { executionId: fact.executionId, checkKey: fact.checkKey, revision: fact.revision, startedAt: fact.startedAt, finishedAt: fact.finishedAt, outcome: fact.outcome, executionEvidence: fact.executionEvidence } });
    }
    if (fact.kind === "session.finished") observations.push({ ...base, kind: "run_finished", body: { outcome: fact.outcome } });
  }
  const result = canonicalizeObservations(observations); return { observations: result.observations, diagnostics: [...diagnostics, ...result.diagnostics] };
}

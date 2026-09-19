import { workObservationSchema } from "./schema.ts";
import type { CanonicalWorkResult, WorkDiagnostic, WorkObservation } from "./types.ts";

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  return JSON.stringify(value);
}

export function canonicalizeObservations(input: unknown[]): CanonicalWorkResult {
  const accepted = new Map<string, WorkObservation>();
  const diagnostics: WorkDiagnostic[] = [];
  for (const raw of input) {
    const parsed = workObservationSchema.safeParse(raw);
    if (!parsed.success) { diagnostics.push({ code: "invalid_observation", message: parsed.error.issues.map((issue) => issue.message).join("; ") }); continue; }
    const observation = parsed.data as WorkObservation;
    const existing = accepted.get(observation.id);
    if (!existing) { accepted.set(observation.id, observation); continue; }
    if (stable(existing) !== stable(observation)) { accepted.delete(observation.id); diagnostics.push({ code: "conflicting_immutable_event_id", message: `Conflicting payloads for ${observation.id}.`, sourceFactId: observation.provenance.sourceFactId }); }
  }
  return { observations: [...accepted.values()].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id)), diagnostics: diagnostics.sort((a, b) => stable(a).localeCompare(stable(b))) };
}

import type { ExperimentalProjection, ExperimentalRepositoryState, WorkDiagnostic, WorkObservation, WorkshopAssociation } from "./types.ts";

const visibleKinds = new Set<WorkObservation["kind"]>(["artifact_changed", "change_proposed", "change_integrated", "artifact_published"]);

export function deriveExperimentalWorkshopState(observations: WorkObservation[], association: WorkshopAssociation, asOf: string, diagnostics: WorkDiagnostic[] = []): ExperimentalProjection {
  const eligible = observations.filter((observation) => observation.occurredAt <= asOf && observation.observedAt <= asOf && observation.repository.id === association.repositoryId);
  const visible = eligible.filter((observation) => visibleKinds.has(observation.kind));
  const byRepository = new Map<string, WorkObservation[]>();
  for (const observation of visible) { const group = byRepository.get(observation.repository.id) ?? []; group.push(observation); byRepository.set(observation.repository.id, group); }
  const repositories: ExperimentalRepositoryState[] = [...byRepository.values()].map((group) => {
    const ordered = [...group].sort((a, b) => a.id.localeCompare(b.id)); const first = ordered[0]!;
    return { repository: first.repository, observed: true, integrationObserved: ordered.some((item) => item.kind === "change_integrated"), publicationObserved: ordered.some((item) => item.kind === "artifact_published"), supportingObservationIds: ordered.map((item) => item.id) };
  }).sort((a, b) => a.repository.id.localeCompare(b.repository.id));
  return { ruleVersion: "work-observation-exp-v1", asOf, workshopId: association.workshopId, repositories, detailObservationIds: eligible.filter((observation) => !visibleKinds.has(observation.kind)).map((observation) => observation.id).sort(), diagnostics: [...diagnostics].sort((a, b) => a.code.localeCompare(b.code) || a.message.localeCompare(b.message)) };
}

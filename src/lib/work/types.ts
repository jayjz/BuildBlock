export const workObservationSchemaVersion = "work-observation-v1" as const;
export const localRunBundleSchemaVersion = "buildblock-local-run-v1" as const;

export type Identity = { id: string; label?: string };
export type RepositoryIdentity = { id: string; name: string };
export type SupportingEvidence = { path?: string; sha256?: string; reference: string };
export type ObservationKind = "run_started" | "artifact_changed" | "verification_finished" | "run_finished" | "change_proposed" | "change_integrated" | "artifact_published";

type ObservationBase = {
  schemaVersion: typeof workObservationSchemaVersion;
  id: string;
  kind: ObservationKind;
  actor: Identity;
  reporter: Identity;
  run?: Identity;
  repository: RepositoryIdentity;
  occurredAt: string;
  observedAt: string;
  provenance: { source: "github" | "local-run"; sourceFactId: string; collector?: string };
  evidence: SupportingEvidence[];
};

export type RunStartedObservation = ObservationBase & { kind: "run_started"; body: { runId: string } };
export type ArtifactChangedObservation = ObservationBase & { kind: "artifact_changed"; body: { before: { revision: string }; after: { revision: string }; patchEvidence: string } | { normalizedActivityId: string; evidenceUrl: string } };
export type VerificationFinishedObservation = ObservationBase & { kind: "verification_finished"; body: { executionId: string; checkKey: string; revision: string; startedAt: string; finishedAt: string; outcome: "passed" | "failed" | "error" | "cancelled"; executionEvidence: string } };
export type RunFinishedObservation = ObservationBase & { kind: "run_finished"; body: { outcome: "completed" | "blocked" | "aborted" } };
export type GitHubWorkObservation = ObservationBase & { kind: "change_proposed" | "change_integrated" | "artifact_published"; body: { normalizedActivityId: string; evidenceUrl: string } };
export type WorkObservation = RunStartedObservation | ArtifactChangedObservation | VerificationFinishedObservation | RunFinishedObservation | GitHubWorkObservation;

export type WorkDiagnostic = { code: string; message: string; sourceFactId?: string };
export type CanonicalWorkResult = { observations: WorkObservation[]; diagnostics: WorkDiagnostic[] };

export type WorkshopAssociation = { repositoryId: string; workshopId: string };
export type ExperimentalRepositoryState = { repository: RepositoryIdentity; observed: boolean; integrationObserved: boolean; publicationObserved: boolean; supportingObservationIds: string[] };
export type ExperimentalProjection = { ruleVersion: "work-observation-exp-v1"; asOf: string; workshopId: string; repositories: ExperimentalRepositoryState[]; detailObservationIds: string[]; diagnostics: WorkDiagnostic[] };

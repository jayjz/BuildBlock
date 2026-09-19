# Work observation contract (experimental)

`work-observation-v1` is the bounded EXP-AGENT-001 contract. It is a parallel experiment and does not change P0's GitHub normalization, world rules, or public UI.

## Boundary

Source evidence is validated before an adapter derives `WorkObservation` records. The adapter output is canonicalized by immutable, namespaced event ID and then passed to the separate `work-observation-exp-v1` projection. Raw local manifests and agent statements never enter a world rule directly.

Each observation has a namespaced ID, actor, reporter, optional run, repository, `occurredAt`, `observedAt`, provenance, supporting evidence, and a discriminated body. Identity and display labels are separate: labels do not determine observation identity. The actor performed the evidenced action; the reporter/collector captured it; the run identifies a bounded execution. Workshop routing is a separate display association. None establishes ownership, delegation, endorsement, authorship, or approval.

## Supported kinds

The local-run adapter emits only `run_started`, `artifact_changed`, `verification_finished`, and `run_finished`. A local artifact change requires a before revision, after revision, and nonempty captured patch. A qualified verification requires a named execution, exact captured revision, times, outcome, and command evidence. `run_started` and `run_finished` have no world consequence. Passing a check does not establish correctness.

The GitHub adapter sits above existing `NormalizedActivity` and maps `code_pushed` to `artifact_changed`, `pull_request_opened` to `change_proposed`, `pull_request_merged` to `change_integrated`, and `release_published` to `artifact_published`. It preserves normalized identities and provenance; it does not recreate GitHub normalization or infer omitted source facts.

## Local bundle

`buildblock-local-run-v1` is a portable source-fact manifest. It contains `session.started`, `worktree.captured`, `command.finished`, and `session.finished` facts as applicable; it contains no derived observations or world events. Local evidence paths are restricted beneath the explicit bundle root and must provide SHA-256. The loader rejects traversal, symlinks, missing files, digest mismatches, and unsupported schemas. It treats every manifest as data and executes no described command.

Run `node scripts/ingest-local-run.mts <bundle-root> <as-of-iso>` to emit validation, canonical observations, diagnostics, the explicit `jayjz/TEMPER` → `jayjz-workshop` association, and projection JSON. The command is offline.

## Experimental projection

The pure projection accepts observations, an explicit association, and explicit `asOf`. Both `occurredAt` and `observedAt` must be at or before `asOf`. `artifact_changed`, `change_proposed`, `change_integrated`, and `artifact_published` can create repository presence. Integration and publication are booleans supported only by their matching kinds. Run and verification kinds remain detail evidence. Repeated observations never multiply markers.

EXP-AGENT-001 proves that one locally captured, source-neutral evidence bundle can be validated and deterministically projected into an inspectable workshop state. It does not prove correctness, approval, integration, publication, agent attribution beyond the captured run identity, remote attestation, hostile-host safety, a public agent product, or a generic provider platform.

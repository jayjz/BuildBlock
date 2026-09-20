# P4 — Agent Activity

## Status

Future phase.

EXP-AGENT-001 is an architecture experiment supporting this direction, not production P4.

## Goal

Allow verified software work performed by coding agents to affect the same world as human software work without turning BuildBlock into an agent dashboard.

## Product thesis

BuildBlock may evolve from:

> a world driven by public GitHub activity

to:

> a world where verified software work — human or agent — changes the place.

GitHub remains a first-class outcome source.

Agents add process evidence.

## Entry criteria

P4 should not become a production feature until:

- P0 validates desire for places;
- identity boundaries are established;
- durable state semantics are understood;
- attribution rules exist;
- EXP-AGENT contracts are hardened.

## Existing experimental proof

EXP-AGENT-001 demonstrates the architecture:

validated local source evidence
→ source-specific adapter
→ WorkObservation[]
→ deterministic experimental projection

It intentionally does not enter the production UI.

## Required hardening before production

Before P4 production integration, resolve at minimum:

- bounded observation-window semantics
- sticky conflicting-ID quarantine
- source-instance identity
- complete source provenance preservation
- evidence referential integrity
- exact artifact identity semantics
- non-empty artifact-change validation

## Agent activity vocabulary

Prefer high-level evidence-backed work observations such as:

- run_started
- artifact_changed
- verification_finished
- run_finished
- change_proposed
- change_integrated
- artifact_published

Do not normalize every tool call.

## Product rules

Agent activity must not become:

- token counts
- step counts
- agent productivity scores
- reasoning traces
- agent leaderboards
- arbitrary animated workers
- chat bubbles
- marketplace listings
- claims of intelligence or quality

## Evidence boundary

An agent saying:

> I changed the code and the tests pass

is not sufficient evidence.

The capture boundary should establish:

- artifact identity
- change evidence
- execution result
- source identity
- timing
- run identity

Agent narration remains a claim unless independently supported.

## Human-agent semantics

Do not automatically infer:

- delegation
- approval
- authorship
- endorsement
- correctness

A human launching an agent does not necessarily establish authorship of every resulting artifact.

A successful agent run does not establish accepted work.

## World consequences

Agent process evidence should enrich an existing place rather than replace it.

Potential semantics:

- active bounded work
- captured artifact change
- verification evidence
- awaiting integration
- integrated outcome
- publication

Most process events should remain detail-only.

## Non-goals

Do not build:

- generalized agent orchestration
- agent marketplace
- autonomous scheduling platform
- provider registry
- LLM observability product
- full transcript viewer
- agent personality system
- token economy

## Acceptance criteria

P4 succeeds only if:

1. agent-derived state is evidence-backed;
2. human and agent sources coexist without semantic corruption;
3. source-specific facts normalize into shared world semantics;
4. unverified agent claims cannot create world-visible state;
5. agent activity materially improves the perceived life/usefulness of the place;
6. users still understand BuildBlock as a software-work world rather than an agent monitoring tool.

## Exit gate

Technical ingestion is insufficient.

Production P4 requires product evidence that agent activity improves BuildBlock's human experience.

## Agent instruction

Do not broaden agent support because additional providers are available.

One trustworthy source-neutral path is preferable to many shallow integrations.

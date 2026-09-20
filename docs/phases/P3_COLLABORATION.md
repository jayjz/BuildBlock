# P3 — Verified Collaboration

## Status

Blocked on durable identity and attribution foundations.

## Goal

Represent meaningful software collaboration between places without inferring relationships from weak signals.

## Product question

> Can verified collaboration make the world feel connected rather than like isolated developer profiles?

## Entry criteria

P3 begins only when BuildBlock has:

- validated places;
- claimed identity;
- durable identity associations;
- evidence semantics capable of distinguishing actors and repositories.

## Principle

Collaboration must be supported by attribution.

Shared repository activity alone does not prove that two people collaborated.

## Candidate collaboration evidence

Potential evidence may include:

- explicit co-authorship
- accepted contribution authored by one verified actor into another relevant project
- review relationship with supported identities
- explicit shared artifact or integration event
- verified team/project relationship

Each source must define exactly what it establishes.

## Forbidden inference

Do not infer collaboration merely because:

- two developers touched the same repository;
- two events occurred close in time;
- users belong to the same organization;
- accounts follow one another;
- commit messages mention another person;
- an AI summary claims collaboration.

## World consequence

Collaboration should produce a relationship between places, not a social score.

Possible future manifestations may include:

- shared project space
- connection/path between workshops
- jointly supported artifact
- temporary shared work state

The exact visual grammar is a later product decision.

## Attribution requirements

Every collaboration relationship requires:

- actor identities
- source
- supported relationship type
- evidence
- relevant artifact/repository
- timestamps
- versioned rule

## Non-goals

Do not add:

- follower/friend graphs
- popularity metrics
- collaboration scores
- team rankings
- messaging
- generic chat
- inferred social relationships

## Acceptance criteria

P3 succeeds when:

1. collaboration state is explainable from evidence;
2. false attribution is strongly constrained;
3. duplicate events do not strengthen the relationship;
4. relationship state survives deterministic re-derivation;
5. participants understand why two places are connected;
6. users find relationships more valuable than isolated activity displays.

## Exit gate

Do not move to autonomous agent inhabitants merely because collaboration can be represented technically.

The collaboration model must first prove that relationships improve the world experience.

## Agent instruction

When evidence is ambiguous, abstain.

A missing collaboration relationship is preferable to a fabricated one.

# P1 — Claimed Identity

## Status

Blocked on successful P0 validation.

## Goal

Allow a developer to establish that a BuildBlock place is associated with them without changing the evidence semantics of public software activity.

## Product question

> Can a person reliably claim a stable BuildBlock identity and recognize a place as theirs?

This phase is about identity, not ownership economics or multiplayer gameplay.

## Entry criteria

P1 begins only after P0 demonstrates:

- understandable workshop identity;
- understandable evidence-backed activity;
- credible user desire to have a block.

## Core requirements

A claimed identity must distinguish:

- BuildBlock account identity
- external GitHub identity
- workshop association
- repository observations
- display preferences

These concepts must not collapse into one identifier.

## Required capabilities

P1 may introduce:

- authentication
- GitHub identity verification
- explicit claim flow
- durable developer-to-workshop association
- basic profile/display preferences
- clear claimed/unclaimed state

## Evidence rules

A claim proves only the supported identity relationship.

It does not prove:

- repository authorship
- ownership of every repository displayed
- endorsement of observed work
- employment
- organizational affiliation
- quality
- productivity

## Security requirements

Identity claims must resist:

- claiming another GitHub identity
- replay of stale authorization
- identity collision
- implicit trust based only on username strings
- client-side-only authorization

Stable provider IDs should be preferred over mutable display names.

## Non-goals

Do not introduce:

- property trading
- scarcity mechanics
- currency
- rankings
- follower systems
- generic social feeds
- agent identity
- team ownership
- complex permissions

## Acceptance criteria

P1 succeeds when:

1. a developer can authenticate;
2. the external identity is verified;
3. exactly one intended workshop association is established;
4. the association survives a new session;
5. changing a display name does not break identity;
6. an unauthorized user cannot claim another developer's place;
7. public evidence remains independent of claimed identity.

## Required tests

At minimum:

- successful claim
- rejected mismatched identity
- stable ID despite username/display-name changes
- duplicate claim handling
- expired/revoked authentication
- unauthenticated mutation rejection
- claimed identity does not alter source evidence
- deterministic public rendering remains available without login

## Exit gate

Do not proceed to durable history merely because authentication works.

P1 exits only when claiming is:

- understandable;
- secure enough for the intended product;
- stable across sessions;
- cleanly separated from software-work evidence.

## Agent instruction

Prefer the smallest secure identity architecture.

Do not add generalized roles, organization systems, billing, or social graph infrastructure unless required by demonstrated P1 behavior.

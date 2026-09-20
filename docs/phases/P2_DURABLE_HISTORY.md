# P2 — Durable History

## Status

Blocked on P1 claimed identity.

## Goal

Allow a workshop to accumulate meaningful historical state without turning BuildBlock into an analytics archive or activity-count game.

## Product question

> Does history make a developer's place feel more meaningful and worth returning to?

## Entry criteria

P2 begins only when:

- users understand and want blocks;
- identity claiming is established;
- stable workshop association exists.

## Principle

Current activity is temporary.

History is durable.

These must remain separate.

Recent source evidence may change what is visible today without rewriting historical facts.

## Candidate durable concepts

P2 may preserve restrained milestones such as:

- first observed repository work
- first integrated change
- first published artifact
- repository arrival in the workshop
- explicitly verified collaboration milestone
- significant place evolution tied to an evidence-backed rule

Do not treat raw event volume as progression.

## Historical record requirements

Each durable historical record needs:

- stable identity
- event/evidence reference
- occurred-at time
- observed-at time
- source/provenance
- versioned derivation rule
- migration/version semantics where necessary

## Non-goals

Do not create:

- commit streaks
- XP
- levels based on activity volume
- wealth scores
- productivity rankings
- arbitrary achievements
- indefinite retention of every raw event
- analytics dashboards disguised as history

## World semantics

History should alter the sense of place, not merely add numbers.

A good durable change should answer:

> Why does this workshop look or feel different because something meaningful happened here?

## Acceptance criteria

P2 succeeds when:

1. history survives beyond the seven-day observation window;
2. current activity and historical state remain distinguishable;
3. historical state is reconstructable from retained evidence;
4. duplicate/reordered source input cannot multiply milestones;
5. old imported evidence cannot falsely appear newly achieved;
6. history creates perceived continuity without rewarding raw volume;
7. users report a stronger reason to return to their place.

## Data requirements

Before adding persistence, explicitly define:

- what is retained
- why it is retained
- retention duration
- reconstruction semantics
- deletion semantics
- source versioning
- migration strategy

## Exit gate

P2 exits only if durable state materially improves place identity.

If history is merely a more attractive activity log, reconsider the model before proceeding.

## Agent instruction

Do not add generic event sourcing or a large persistence platform before the smallest historical rule has demonstrated product value.

Store only what the validated history contract requires.

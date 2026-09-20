# P0 — Validate the Place

## Status

Current product gate.

P0 asks whether an evidence-backed developer place is understandable and desirable before BuildBlock adds ownership, persistence, multiplayer, or AI.

## Product hypothesis

A developer presented as a stable physical place, temporarily changed by evidence-backed public software work, is more compelling than a conventional activity dashboard.

The key question is:

> Does a developer see BuildBlock and want a block of their own?

## Current system under test

P0 includes:

- District 01
- stable developer workshops
- stable addresses and architectural identity
- repository-fronted observed work
- bounded merge state
- bounded publication/release state
- seven-day observation window
- source-backed detail
- deterministic world derivation
- explicitly recorded fallback data

P0 does not include:

- accounts
- claiming
- authentication
- persistent user history
- multiplayer
- rankings
- scores
- currency
- AI agents

## Validation questions

For an unbriefed participant:

1. What do you think this is?
2. What does a workshop represent?
3. Why is this repository visible here?
4. What do you think the joined-piece state means?
5. What do you think the publication state means?
6. What do you expect if no work is observed for several days?
7. Would you want a block of your own?
8. Why or why not?
9. What would make you return?
10. What feels confusing or unnecessary?

## Minimum qualitative sample

Run the test with at least five software developers who have not followed BuildBlock's development closely.

Do not explain the product before the initial comprehension questions.

Preserve their answers as observations rather than rewriting them into expected terminology.

## Acceptance criteria

### Comprehension

- At least 4 of 5 participants identify workshops as developer-associated places.
- At least 4 of 5 understand repository frontage as recently observed work.
- No more than 1 of 5 interprets the district as a productivity leaderboard.

### Evidence comprehension

- At least 4 of 5 can find supporting evidence for a visible repository/state.
- Merge state is not broadly interpreted as deployment, quality, or correctness.
- Publication state is not broadly interpreted as production success.

### Desire

- At least 3 of 5 say they would want a block of their own.
- Record the stated reason.
- Record what they would expect to happen after obtaining one.

## Failure signals

Treat these as meaningful failures:

- "GitHub dashboard with houses."
- Users cannot explain why a repository appears.
- Stable place and temporary activity are confused.
- Users primarily ask for rankings or scores.
- Users like the visuals but do not want a place.
- Evidence details are ignored or impossible to understand.

## Evidence to retain

For every session record:

- date
- participant type
- first-impression answer
- answers to validation questions
- observed confusion
- desire/no-desire answer
- return motivation
- notable direct quotes
- evaluator notes

Do not infer market demand from five interviews.

## Exit gate

P0 may exit only when:

1. the place metaphor is broadly understood;
2. evidence-backed state is understandable;
3. there is credible qualitative desire for personal blocks;
4. major confusion does not require redesigning the core metaphor.

If P0 fails, improve the place experience before implementing identity or persistence.

## Agent instruction

Do not implement P1 functionality while this gate is unresolved.

Engineering work during P0 should prioritize:

- comprehension
- evidence clarity
- spatial hierarchy
- accessibility
- deterministic correctness
- validation instrumentation

Do not use new infrastructure to compensate for weak product validation.

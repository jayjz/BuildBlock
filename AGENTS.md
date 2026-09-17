# BuildBlock

BuildBlock is a persistent multiplayer developer world where real software activity changes the world.

## Product invariants

- Real software work drives world state.
- Every developer should have a recognizable place in the world.
- GitHub source facts must remain separate from game interpretation.
- World state should be deterministic and explainable.
- Collaboration should eventually matter more than raw activity volume.
- The initial product must work without AI.
- AI agents are a future inhabitant of the world, not the foundation of the product.

## Non-goals

Do not turn BuildBlock into:

- a GitHub analytics dashboard with game decoration
- a generic social network
- a commit-count leaderboard
- a Monopoly clone
- a crypto/token project
- an AI agent marketplace
- a premature microservice system

## Architecture boundary

Preserve this dependency direction:

GitHub source data
→ normalized domain facts
→ deterministic world rules
→ derived world state
→ presentation

React components must not interpret raw GitHub API payloads directly.

Keep network IO outside core world logic.

Prefer pure functions for world-state derivation.

## Engineering rules

- TypeScript strictness.
- No fabricated GitHub activity.
- Fixture data must be identifiable as fixtures.
- Live GitHub failure must degrade gracefully.
- No opaque scoring.
- No premature persistence or authentication for P0.
- No unused speculative abstractions.
- Core world-rule calculations require unit tests.
- Accessibility is required.
- Never commit credentials.
- Verify before claiming completion.

## Current phase

P0: prove that a living GitHub-driven developer board is visually and conceptually compelling.

Do not allow later multiplayer, persistence, authentication, or agent phases to contaminate P0.

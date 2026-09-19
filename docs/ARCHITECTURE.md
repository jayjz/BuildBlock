# Architecture

The dependency direction is fixed: GitHub source responses → validated facts → normalized activity → deterministic world events and block state → presentation.

`src/lib/github` validates and normalizes public REST responses. `src/lib/world` is pure and has no network or clock access. `deriveBlockState` applies the observation window once and derives deterministic repository groups, including repository-specific merge and release booleans, for every eligible normalized activity. `src/lib/developers` is server-only composition; it fetches live public data and falls back to explicitly recorded source facts. React receives `DeveloperExperience`, never raw GitHub responses, and renders the canonical groups without regrouping activity.

P0 uses only three configured public profiles and no persistence, authentication, or backend services. Next fetch revalidation is the only cache behavior.

## EXP-AGENT-001 (parallel experiment)

The production path remains unchanged. A separate, offline experimental path is `validated source evidence → source-specific adapter → canonical WorkObservation[] → deterministic experimental workshop projection`. It is documented in `docs/WORK_OBSERVATION_CONTRACT.md`; it has no dependency into P0's GitHub normalization, world derivation, or React presentation.

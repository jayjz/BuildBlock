# BuildBlock Product Phases

The roadmap is gate-driven.

Do not treat later phases as permission to implement them early.

## Phase sequence

1. [P0 — Validate the Place](./phases/P0_VALIDATION.md)
2. [P1 — Claimed Identity](./phases/P1_IDENTITY.md)
3. [P2 — Durable History](./phases/P2_DURABLE_HISTORY.md)
4. [P3 — Verified Collaboration](./phases/P3_COLLABORATION.md)
5. [P4 — Agent Activity](./phases/P4_AGENTS.md)

## Current phase

P0 validation is the current product gate.

The existing `feat/exp-agent-001` work is a bounded architecture experiment for a possible P4 capability. It does not advance the production roadmap past P0.

## Rule for agents

Before implementing work from a later phase:

1. read the preceding phase exit gate;
2. determine whether repository evidence establishes that the gate has passed;
3. if not, do not silently advance the roadmap;
4. perform work appropriate to the current phase or report the unmet gate.

Technical feasibility does not equal product validation.

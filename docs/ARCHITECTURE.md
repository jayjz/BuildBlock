# Architecture

The dependency direction is fixed: GitHub source responses → validated facts → normalized activity → deterministic world events and block state → presentation.

`src/lib/github` validates and normalizes public REST responses. `src/lib/world` is pure and has no network or clock access. `src/lib/developers` is server-only composition; it fetches live public data and falls back to explicitly recorded source facts. React receives `DeveloperExperience`, never raw GitHub responses.

P0 uses only three configured public profiles and no persistence, authentication, or backend services. Next fetch revalidation is the only cache behavior.

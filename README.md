# BuildBlock

BuildBlock is a persistent developer world where public GitHub activity changes a recognizable block in a shared district.

## Run locally

```bash
npm install
npm run dev
```

For a reproducible offline board, copy `.env.example` to `.env.local` and set `BUILDBLOCK_DATA_MODE=recorded`.

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

See `docs/` for product, architecture, world-rule, and roadmap decisions.

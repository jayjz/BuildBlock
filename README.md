# BuildBlock

A persistent multiplayer developer world where real software activity changes the world.

## Status

Early prototype.

Current goal: build a living board populated by developers whose spaces visibly respond to real GitHub activity.

## Development

```bash
npm install
npm run dev
Verification
npm run lint
npm run typecheck
npm test
npm run build

See AGENTS.md and docs/ for product and architecture decisions.
EOF


Leave the deeper docs empty. Astra should author those after inspecting the repo.

### 6. Add an environment template

```bash
cat > .env.example <<'EOF'
# Optional during P0.
# Public GitHub requests can work without authentication but are rate limited.

GITHUB_TOKEN=
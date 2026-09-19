import { adaptLocalRunBundle, loadLocalRunBundle } from "../src/lib/work/local-run-adapter.ts";
import { deriveExperimentalWorkshopState } from "../src/lib/work/projection.ts";

const [bundleRoot, asOf] = process.argv.slice(2);
if (!bundleRoot || !asOf) throw new Error("Usage: node scripts/ingest-local-run.ts <bundle-root> <as-of-iso>");
const loaded = loadLocalRunBundle(bundleRoot);
const derived = loaded.bundle ? adaptLocalRunBundle(loaded.bundle) : { observations: [], diagnostics: [] };
const diagnostics = [...loaded.diagnostics, ...derived.diagnostics];
const association = { repositoryId: "github-repository:1373439999", workshopId: "jayjz-workshop" };
const projection = deriveExperimentalWorkshopState(derived.observations, association, asOf, diagnostics);
process.stdout.write(`${JSON.stringify({ validation: { valid: diagnostics.length === 0, diagnostics }, observations: derived.observations, workshopAssociation: association, projection }, null, 2)}\n`);

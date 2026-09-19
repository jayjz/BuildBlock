import { DistrictBoard } from "@/components/district-board";
import { loadDeveloper } from "@/lib/developers";

export default async function Home() {
  const loaded = await Promise.all(["jayjz", "antfu", "shuding"].map(loadDeveloper));
  return <main><DistrictBoard developers={loaded.filter((entry): entry is NonNullable<typeof entry> => entry !== null)} /></main>;
}

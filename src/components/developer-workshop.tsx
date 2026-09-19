import type { CuratedDeveloper } from "@/data/developers";
import type { DeveloperExperience } from "@/lib/developers";

type DeveloperWorkshopProps = {
  developer: CuratedDeveloper;
  experience?: DeveloperExperience;
  selected: boolean;
  onInspect?: () => void;
  workshopRef?: (element: HTMLButtonElement | null) => void;
};

const address = (value: number) => value.toString().padStart(2, "0");
const captureLabel = (value: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));

export function DeveloperWorkshop({ developer, experience, selected, onInspect, workshopRef }: DeveloperWorkshopProps) {
  const repositories = experience?.state.repositories.slice(0, 3) ?? [];
  const resident = experience?.profile.name ?? developer.login;
  const moreCount = (experience?.state.repositories.length ?? 0) - repositories.length;
  const frontageSummary = repositories.map((group) => {
    const states = ["recently observed work"];
    if (group.hasMerge) states.push("pull request merge observed");
    if (group.hasRelease) states.push("release published");
    return `${group.repository.name}, ${states.join(", ")}`;
  }).join("; ");
  const label = `Inspect ${resident}, workshop ${address(developer.address)}. ${repositories.length === 0 ? "No public work observed in this window." : `Recently observed here: ${frontageSummary}.`}`;

  if (!experience) {
    return <div className={`workshop workshop--${developer.shape} workshop--${developer.color} workshop--unavailable`} aria-label={`${developer.login}, address ${address(developer.address)}, workshop unavailable`}>
      <WorkshopStructure developer={developer} resident={resident} repositories={[]} moreCount={0} unavailable />
    </div>;
  }

  return <button type="button" ref={workshopRef} className={`workshop workshop--${developer.shape} workshop--${developer.color}`} onClick={onInspect} aria-pressed={selected} aria-label={label}>
    <WorkshopStructure developer={developer} resident={resident} repositories={repositories} moreCount={moreCount} source={experience.source} capturedAt={experience.capturedAt} />
  </button>;
}

type WorkshopStructureProps = {
  developer: CuratedDeveloper;
  resident: string;
  repositories: DeveloperExperience["state"]["repositories"][number][];
  moreCount: number;
  source?: DeveloperExperience["source"];
  capturedAt?: string;
  unavailable?: boolean;
};

function WorkshopStructure({ developer, resident, repositories, moreCount, source, capturedAt, unavailable }: WorkshopStructureProps) {
  return <>
    <span className="workshop-building" aria-hidden="true">
      <span className="workshop-roof"><i /><i /></span>
      <span className="workshop-facade"><span className="workshop-window" /><span className="workshop-door" /><span className="workshop-window" /></span>
      <span className="workshop-nameplate">{resident} <small>@{developer.login}</small></span>
    </span>
    <span className="workshop-threshold"><strong>{address(developer.address)}</strong><em>threshold</em></span>
    <span className="work-apron">
      <span className="apron-heading">Recently observed here</span>
      <span className="workbench">
        {repositories.length === 0 ? <span className="workbench-empty">{unavailable ? "Workshop unavailable" : "No public work observed in this window."}</span> : repositories.map((group) => <span className="repository-placard" key={group.repository.id}>
          <span className="repository-name">{group.repository.name}</span>
          <span className="repository-objects" aria-hidden="true">
            {group.hasMerge && <span className="repository-object repository-object--merge" title="Pull request merge observed"><i /><i /></span>}
            {group.hasRelease && <span className="repository-object repository-object--release" title="Release published"><i /></span>}
          </span>
        </span>)}
      </span>
      {moreCount > 0 && <span className="workshop-more">+{moreCount} more observed repositories</span>}
      {source && capturedAt && <span className="workshop-source">{source === "live" ? "Live public GitHub" : "Recorded GitHub fixture"} · captured {captureLabel(capturedAt)}</span>}
    </span>
  </>;
}

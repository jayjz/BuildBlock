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

export function DeveloperWorkshop({ developer, experience, selected, onInspect, workshopRef }: DeveloperWorkshopProps) {
  const repositories = experience?.state.repositories.slice(0, 3) ?? [];
  const resident = experience?.profile.name ?? developer.login;
  const moreCount = (experience?.state.repositories.length ?? 0) - repositories.length;
  const frontageSummary = repositories.map((group) => `${group.repository.name}${group.hasMerge ? ", joined work observed" : ""}${group.hasRelease ? ", release observed" : ""}`).join("; ");
  const frontage = <>
    <div className="workshop-roof" aria-hidden="true"><i /><i /></div>
    <div className="workshop-facade" aria-hidden="true">
      <div className="work-bays">
        {Array.from({ length: 3 }, (_, index) => {
          const group = repositories[index];
          if (!group) return <div className="work-bay work-bay--empty" key={`empty-${index}`} />;
          return <div className="work-bay" key={group.repository.id}>
            <span className="work-bay-light" />
            <span className="work-bay-name">{group.repository.name}</span>
            <span className="work-bay-evidence">Observed</span>
            <span className="work-bay-markers">
              {group.hasMerge && <span className="work-bay-marker work-bay-marker--merge">Joined</span>}
              {group.hasRelease && <span className="work-bay-marker work-bay-marker--release">Released</span>}
            </span>
          </div>;
        })}
      </div>
      {moreCount > 0 && <span className="workshop-more">+{moreCount}</span>}
    </div>
    <span className="workshop-threshold" aria-hidden="true" />
    <span className="workshop-nameplate">{resident}</span>
    <span className="workshop-address">{address(developer.address)}</span>
  </>;

  if (!experience) {
    return <div className={`workshop workshop--${developer.shape} workshop--${developer.color} workshop--unavailable`} aria-label={`${developer.login}, address ${address(developer.address)}, workshop unavailable`}>
      {frontage}<span className="workshop-unavailable">Unavailable</span>
    </div>;
  }

  return <button type="button" ref={workshopRef} className={`workshop workshop--${developer.shape} workshop--${developer.color}`} onClick={onInspect} aria-pressed={selected} aria-label={`Inspect ${resident}, workshop ${address(developer.address)}. ${repositories.length === 0 ? "No public work observed in this window." : `Recently observed here: ${frontageSummary}.`}`}>
    {frontage}
  </button>;
}

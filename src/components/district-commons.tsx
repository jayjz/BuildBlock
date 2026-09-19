import type { DeveloperExperience } from "@/lib/developers";

type DistrictCommonsProps = { developers: DeveloperExperience[]; onInspect: (experience: DeveloperExperience) => void };

export function DistrictCommons({ developers, onInspect }: DistrictCommonsProps) {
  return <section className="district-commons" aria-label="District 01 wayfinding court">
    <div className="commons-court" aria-hidden="true"><span /><span /><span /><span /></div>
    <div className="commons-copy">
      <p className="eyebrow">BUILD BLOCK</p>
      <h1>District 01</h1>
      <p>Wayfinding court</p>
    </div>
    <nav className="commons-directory" aria-label="Workshop directory">
      {developers.map((experience) => <button type="button" key={experience.developer.login} onClick={() => onInspect(experience)}>
        <span>{experience.profile.name ?? experience.profile.login}</span><small>{experience.developer.address.toString().padStart(2, "0")}</small>
      </button>)}
    </nav>
  </section>;
}

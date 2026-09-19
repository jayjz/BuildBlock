"use client";

import { useEffect, useRef, useState } from "react";
import { boardSpaces } from "@/data/board";
import { curatedDevelopers } from "@/data/developers";
import type { DeveloperExperience } from "@/lib/developers";
import { DeveloperWorkshop } from "./developer-workshop";
import { DistrictCommons } from "./district-commons";
import { WorkshopDetail } from "./workshop-detail";

const position = (index: number) => {
  if (index <= 10) return `1 / ${index + 1}`;
  if (index <= 20) return `${index - 9} / 11`;
  if (index <= 30) return `11 / ${31 - index}`;
  return `${41 - index} / 1`;
};

const address = (value: number) => value.toString().padStart(2, "0");

export function DistrictBoard({ developers }: { developers: DeveloperExperience[] }) {
  const [selected, setSelected] = useState<DeveloperExperience | null>(null);
  const originRef = useRef<HTMLButtonElement | null>(null);
  const workshopRefs = useRef(new Map<string, HTMLButtonElement>());
  const byLogin = new Map(developers.map((experience) => [experience.developer.login, experience]));
  const available = [...developers].sort((a, b) => a.developer.address - b.developer.address);

  useEffect(() => {
    if (!selected) return;
    workshopRefs.current.get(selected.developer.login)?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }, [selected]);

  const inspect = (experience: DeveloperExperience, origin?: HTMLButtonElement | null) => {
    if (origin) originRef.current = origin;
    setSelected(experience);
  };
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() => originRef.current?.focus());
  };
  const currentIndex = selected ? available.findIndex((experience) => experience.developer.login === selected.developer.login) : -1;
  const nextExperience = currentIndex >= 0 && available.length > 1 ? available[(currentIndex + 1) % available.length]! : undefined;
  const next = () => {
    if (!nextExperience) return;
    originRef.current = workshopRefs.current.get(nextExperience.developer.login) ?? null;
    setSelected(nextExperience);
  };

  return <div className="district-layout">
    <section className="board-shell" aria-label="BuildBlock District 01 board">
      <div className="district-board">
        <div className="district-map" aria-label="District 01 orientation map">
          {boardSpaces.map((space) => {
            const experience = space.login ? byLogin.get(space.login) : undefined;
            if (space.kind === "developer") {
              const developer = curatedDevelopers.find((entry) => entry.login === space.login)!;
              return <div key={space.index} className={`space space--developer${selected?.developer.login === developer.login ? " space--selected" : ""}`} style={{ gridArea: position(space.index) }}>
                {experience ? <button type="button" className="address-anchor" onClick={(event) => inspect(experience, event.currentTarget)} aria-label={`Inspect ${experience.profile.name ?? experience.profile.login}, address ${address(developer.address)}`}>{address(developer.address)}</button> : <span className="address-anchor">{address(developer.address)}</span>}
              </div>;
            }
            if (space.kind === "civic") return <div key={space.index} className="space space--civic" style={{ gridArea: position(space.index) }}><span>{space.label}</span></div>;
            return <div key={space.index} className="space space--open" style={{ gridArea: position(space.index) }} aria-label={`Surveyed open plot ${address(space.index)}`}><span>{address(space.index)}</span></div>;
          })}
          <DistrictCommons />
        </div>
        <div className="district-parcels" aria-label="Developer workshops">
          {available.map((experience) => <DeveloperWorkshop key={experience.developer.login} developer={experience.developer} experience={experience} selected={selected?.developer.login === experience.developer.login} onInspect={() => inspect(experience, workshopRefs.current.get(experience.developer.login))} workshopRef={(element) => { if (element) workshopRefs.current.set(experience.developer.login, element); else workshopRefs.current.delete(experience.developer.login); }} />)}
        </div>
      </div>
    </section>
    {selected && <WorkshopDetail experience={selected} onClose={close} onNext={next} nextName={nextExperience?.profile.name ?? nextExperience?.profile.login} hasNext={Boolean(nextExperience)} />}
  </div>;
}

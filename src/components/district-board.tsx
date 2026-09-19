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
  const next = () => {
    if (!selected || available.length < 2) return;
    const currentIndex = available.findIndex((experience) => experience.developer.login === selected.developer.login);
    setSelected(available[(currentIndex + 1) % available.length]!);
  };

  return <div className={`district-layout${selected ? " district-layout--inspecting" : ""}`}>
    <nav className="mobile-directory" aria-label="Workshop directory">
      {available.map((experience) => <button type="button" key={experience.developer.login} onClick={(event) => inspect(experience, event.currentTarget)}>{experience.profile.name ?? experience.profile.login} <small>{experience.developer.address.toString().padStart(2, "0")}</small></button>)}
    </nav>
    <section className="board-shell" aria-label="BuildBlock District 01 board">
      <div className="district-board">
        {boardSpaces.map((space) => {
          const experience = space.login ? byLogin.get(space.login) : undefined;
          if (space.kind === "developer") {
            const developer = curatedDevelopers.find((entry) => entry.login === space.login)!;
            return <div key={space.index} className={`space space--developer${selected?.developer.login === developer.login ? " space--selected" : ""}`} style={{ gridArea: position(space.index) }}>
              <DeveloperWorkshop developer={developer} experience={experience} selected={selected?.developer.login === developer.login} onInspect={experience ? () => inspect(experience, workshopRefs.current.get(developer.login)) : undefined} workshopRef={(element) => { if (element) workshopRefs.current.set(developer.login, element); else workshopRefs.current.delete(developer.login); }} />
            </div>;
          }
          if (space.kind === "civic") return <div key={space.index} className="space space--civic" style={{ gridArea: position(space.index) }}><span>{space.label}</span></div>;
          return <div key={space.index} className="space space--open" style={{ gridArea: position(space.index) }} aria-label="Surveyed open plot"><i aria-hidden="true" /><span>{space.index.toString().padStart(2, "0")}</span></div>;
        })}
        <DistrictCommons developers={available} onInspect={(experience) => inspect(experience)} />
      </div>
    </section>
    {selected && <WorkshopDetail experience={selected} onClose={close} onNext={next} hasNext={available.length > 1} />}
  </div>;
}

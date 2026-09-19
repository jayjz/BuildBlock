"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { DeveloperExperience } from "@/lib/developers";
import type { ActivityKind } from "@/lib/github/types";

const labels: Record<ActivityKind, string> = {
  code_pushed: "Code pushed",
  pull_request_opened: "Pull request opened",
  pull_request_merged: "Pull request merged",
  release_published: "Release published",
};

const dateTime = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC";

type WorkshopDetailProps = { experience: DeveloperExperience; onClose: () => void; onNext: () => void; hasNext: boolean };

export function WorkshopDetail({ experience, onClose, onNext, hasNext }: WorkshopDetailProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, [experience.developer.login]);
  const { developer, profile, state } = experience;

  return <aside className="workshop-detail" aria-label={`${profile.name ?? profile.login} workshop details`}>
    <div className="detail-topline"><p className="eyebrow">WORKSHOP {developer.address.toString().padStart(2, "0")}</p><button type="button" className="detail-close" onClick={onClose}>Close</button></div>
    <div className="detail-heading">
      <Image src={profile.avatar_url} alt="" width={58} height={58} />
      <div><h2 ref={headingRef} tabIndex={-1}>{profile.name ?? profile.login}</h2><a href={profile.html_url} target="_blank" rel="noreferrer">@{profile.login} ↗</a></div>
    </div>
    <dl className="detail-facts">
      <div><dt>Source</dt><dd>{experience.source === "live" ? "Live public GitHub data" : "Recorded GitHub fixture"}</dd></div>
      <div><dt>Captured</dt><dd>{dateTime(experience.capturedAt)}</dd></div>
      <div><dt>Observed window</dt><dd>{dateTime(state.observationWindow.startsAt)} to {dateTime(state.observationWindow.endsAt)}</dd></div>
    </dl>
    <section>
      <h3>Recently observed here</h3>
      {state.repositories.length === 0 ? <p>No public work observed in this window.</p> : <ul className="repository-list">
        {state.repositories.map((group) => <li key={group.repository.id} className="repository-group">
          <div className="repository-heading"><a href={`https://github.com/${group.repository.name}`} target="_blank" rel="noreferrer">{group.repository.name} ↗</a><span>Observed {dateTime(group.latestObservedAt)}</span></div>
          <p className="repository-state"><span className="observed-work">Observed work</span>{group.hasMerge && <span className="merge-state">Joined work observed</span>}{group.hasRelease && <span className="release-state">Release observed</span>}</p>
          <ul className="evidence-list">
            {group.activities.map((activity) => <li key={activity.id}><a href={activity.evidenceUrl} target="_blank" rel="noreferrer">{labels[activity.kind]} ↗</a><time dateTime={activity.occurredAt}>{dateTime(activity.occurredAt)}</time></li>)}
          </ul>
        </li>)}
      </ul>}
    </section>
    <section className="detail-limits">
      <h3>What this view covers</h3>
      <p>These are supported public GitHub events observed in this bounded window. They can be incomplete and do not show a complete project inventory, current presence, ownership, productivity, or project quality.</p>
    </section>
    {hasNext && <button type="button" className="next-workshop" onClick={onNext}>Visit next workshop <span aria-hidden="true">→</span></button>}
  </aside>;
}

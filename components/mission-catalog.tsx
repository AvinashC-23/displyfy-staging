"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MissionTile } from "./mission-tile";
import type { Mission } from "@/lib/types";

export function MissionCatalog({ missions }: { missions: Mission[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(missions.map(mission => mission.category)))];
  const visible = useMemo(() => missions.filter(mission => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || `${mission.name} ${mission.brandName} ${mission.objective}`.toLowerCase().includes(search);
    return matchesQuery && (category === "all" || mission.category === category);
  }), [category, missions, query]);

  return <>
    <div className="catalog-tools">
      <label className="catalog-search"><Search size={18} aria-hidden /><span className="sr-only">Search missions</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by brand, product, or brief" /></label>
      <div className="category-filter" aria-label="Filter by category"><SlidersHorizontal size={17} aria-hidden />{categories.map(item => <button className={category === item ? "active" : ""} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    </div>
    {visible.length > 0 ? <div className="mission-grid">{visible.map((mission) => <MissionTile mission={mission} key={mission.id} />)}</div> : <div className="empty-state"><h2>No missions match that search.</h2><p>Try another product, brand, or category.</p></div>}
  </>;
}

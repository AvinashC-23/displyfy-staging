import type { Metadata } from "next";
import { MissionCatalog } from "@/components/mission-catalog";
import { WorkspaceNav } from "@/components/workspace-nav";
import { getRepositoryForRole } from "@/lib/repository";

export const metadata: Metadata = { title: "Creator missions" };

export default async function Page() {
  const repo = await getRepositoryForRole("creator");
  const missions = await repo.listMissions();
  return <div className="workspace-shell">
    <WorkspaceNav role="creator" />
    <header className="catalog-heading"><p className="workspace-kicker">Creator opportunities</p><h1>Find work that fits your content.</h1><p>Browse every visible mission like a product catalog. Open one to see the full brief, eligibility, timeline, and payout before applying.</p></header>
    <MissionCatalog missions={missions} />
  </div>;
}

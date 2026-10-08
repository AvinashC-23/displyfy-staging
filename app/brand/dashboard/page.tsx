import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CircleDollarSign, GalleryVerticalEnd, Plus } from "lucide-react";
import { MissionTile } from "@/components/mission-tile";
import { StatusPill } from "@/components/status-pill";
import { WorkspaceNav } from "@/components/workspace-nav";
import { formatMoney } from "@/lib/domain";
import { getRepositoryForRole } from "@/lib/repository";
import { getAppMode } from "@/lib/config";

export const metadata: Metadata = { title: "Brand home" };

export default async function Page() {
  const mode = getAppMode();
  const repo = await getRepositoryForRole("brand");
  const [missions, submissions] = await Promise.all([repo.listMissions(), repo.listSubmissions()]);
  const committed = missions.reduce((sum, mission) => sum + mission.committedBudgetMinor, 0);

  return <div className="workspace-shell">
    <WorkspaceNav role="brand" />
    <header className="workspace-welcome"><div><p className="workspace-kicker">Brand home · {mode} environment</p><h1>Northline Goods</h1><p>Shape clear creator work, review it confidently, and keep every campaign decision visible.</p></div><StatusPill status="approved" /></header>

    <section className="brand-command">
      <div className="brand-command-art"><Image src="/assets/editorial/creator-collaboration-editing.webp" alt="Creators reviewing a short video together" fill preload sizes="(max-width: 900px) 100vw, 55vw" /></div>
      <div className="brand-command-copy"><BadgeCheck size={24} /><p className="workspace-kicker">Campaign control without the clutter</p><h2>Brief the work clearly. Let creators make it watchable.</h2><p>Start with the product placement, define what must be visible, and make approval criteria understandable before creators join.</p><Link className="button acid" href="/brand/missions/new"><Plus size={18} />Create a mission</Link></div>
    </section>

    <section className="workspace-section" id="missions">
      <div className="workspace-section-heading"><div><p className="workspace-kicker">Your missions</p><h2>Campaigns, presented as products.</h2></div><Link href="/brand/missions/new">Create another <ArrowRight size={17} /></Link></div>
      <div className="mission-grid">{missions.map((mission) => <MissionTile mission={mission} hrefBase="/brand/missions" key={mission.id} />)}</div>
    </section>

    <section className="brand-overview">
      <div className="brand-stat"><GalleryVerticalEnd size={23} /><span>Creator submissions</span><strong>{submissions.length}</strong><p>Published work waiting for review or performance monitoring.</p></div>
      <div className="brand-stat"><CircleDollarSign size={23} /><span>Budget committed</span><strong>{formatMoney(committed, "USD")}</strong><p>Maximum payout reserved across active creator spots.</p></div>
      <div className="creator-work-preview"><Image src="/assets/editorial/tech-creator-laptop-sticker.webp" alt="Tech creator recording content beside a laptop" fill sizes="(max-width: 900px) 100vw, 40vw" /><div><span>Creator work</span><strong>Review the story, not another spreadsheet.</strong></div></div>
    </section>
  </div>;
}

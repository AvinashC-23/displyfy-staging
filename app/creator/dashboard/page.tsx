import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleDollarSign, CirclePlay, Compass, Sparkles } from "lucide-react";
import { MissionTile } from "@/components/mission-tile";
import { ReelSubmissionForm } from "@/components/forms/reel-submission-form";
import { StatusPill } from "@/components/status-pill";
import { WorkspaceNav } from "@/components/workspace-nav";
import { formatMoney, isCreatorEligibleForMission } from "@/lib/domain";
import { getRepositoryForRole } from "@/lib/repository";
import { getAppMode } from "@/lib/config";

export const metadata: Metadata = { title: "Creator home" };

export default async function Page() {
  const mode = getAppMode();
  const repo = await getRepositoryForRole("creator");
  const [creators, missions, submissions] = await Promise.all([repo.listCreators(), repo.listMissions(), repo.listSubmissions()]);
  const creator = creators.find(item => item.status === "approved") ?? creators[0];
  const eligible = missions.filter(mission => isCreatorEligibleForMission(creator, mission));
  const earnings = submissions.reduce((sum, item) => sum + item.payoutEligibleMinor, 0);

  return <div className="workspace-shell">
    <WorkspaceNav role="creator" />
    <header className="workspace-welcome">
      <div><p className="workspace-kicker">Creator home · {mode} environment</p><h1>Good morning, {creator.displayName}.</h1><p>Find a brief that feels natural, understand it fully, then make it yours.</p></div>
      <StatusPill status={creator.status} />
    </header>

    <section className="next-step">
      <div className="next-step-copy"><span className="next-step-icon"><Compass size={23} /></span><p className="workspace-kicker">Your next move</p><h2>Choose a mission before planning the content.</h2><p>You have {eligible.length} opportunities that match your profile. Every brief includes the creative ask, disclosure, dates, and payout milestones.</p><Link className="button acid" href="/creator/missions">Browse matching missions <ArrowRight size={18} /></Link></div>
      <div className="next-step-art"><Image src="/assets/illustrations/paid-partnership.webp" alt="Illustration of transparent paid partnership content on a phone" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div>
    </section>

    <section className="workspace-section">
      <div className="workspace-section-heading"><div><p className="workspace-kicker">Recommended for you</p><h2>Opportunities worth opening.</h2></div><Link href="/creator/missions">View every mission <ArrowRight size={17} /></Link></div>
      <div className="mission-grid">{missions.slice(0, 3).map((mission, index) => <MissionTile mission={mission} key={mission.id} priority={index < 2} />)}</div>
    </section>

    <section className="creator-overview">
      <div className="earnings-block"><CircleDollarSign size={24} /><span>Eligible earnings</span><strong>{formatMoney(earnings, "USD")}</strong><p>Payout eligibility appears after placement, disclosure, and performance are reviewed.</p></div>
      <div className="activity-block"><div className="workspace-section-heading"><div><p className="workspace-kicker">Your current work</p><h2>{submissions.length} submitted Reels</h2></div></div>{submissions.length ? submissions.map(submission => <article className="activity-item" key={submission.id}><CirclePlay size={20} /><div><strong>{missions.find(mission => mission.id === submission.missionId)?.name ?? "Creator mission"}</strong><span>{submission.views.toLocaleString()} views · {submission.status.replaceAll("_", " ")}</span></div><StatusPill status={submission.status} /></article>) : <p className="muted">Your accepted missions and submitted Reels will appear here.</p>}</div>
    </section>

    <details className="submission-drawer"><summary><span><Sparkles size={20} />Already published? Submit a Reel for review.</span><ArrowRight size={18} /></summary><div className="submission-drawer-body"><ReelSubmissionForm missions={missions} /></div></details>
  </div>;
}

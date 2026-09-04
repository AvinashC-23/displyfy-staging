import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarDays, CircleDollarSign, Clock3, Eye, ShieldCheck, UsersRound } from "lucide-react";
import { formatMoney } from "@/lib/domain";
import { formatMissionDate, getMissionAvailability, getMissionImage } from "@/lib/mission-presentation";
import type { Mission } from "@/lib/types";
import { MissionApplicationForm } from "./forms/mission-application-form";

export function MissionDetail({ mission, mode, canApply = false, unavailableReason }: { mission: Mission; mode: "creator" | "brand"; canApply?: boolean; unavailableReason?: string }) {
  const availability = getMissionAvailability(mission);
  return <div className="workspace-shell mission-detail-page">
    <Link className="back-link" href={mode === "creator" ? "/creator/missions" : "/brand/dashboard#missions"}><ArrowLeft size={17} aria-hidden /> Back to {mode === "creator" ? "missions" : "workspace"}</Link>
    <section className="mission-detail-hero">
      <div className="mission-detail-image"><Image src={getMissionImage(mission)} alt="" fill priority sizes="(max-width: 900px) 100vw, 55vw" /><span className={`availability ${availability.available ? "is-open" : ""}`}>{availability.label}</span></div>
      <div className="mission-detail-intro">
        <div className="mission-tile-brand">{mission.brandVerified && <BadgeCheck size={18} aria-hidden />}<span>{mission.brandName}</span></div>
        <p className="workspace-kicker">{mission.category} · {mission.accessMode} mission</p>
        <h1>{mission.name}</h1>
        <p>{mission.objective}</p>
        <div className="detail-price"><strong>{formatMoney(mission.maxPayoutMinor, mission.currency)}</strong><span>maximum creator payout</span></div>
      </div>
    </section>

    <div className="mission-detail-layout">
      <div className="mission-detail-main">
        <section className="detail-section"><h2>The creative ask</h2><p>{mission.placementInstructions}</p><div className="detail-facts"><div><Clock3 size={20} /><span>Product visibility</span><strong>{mission.requiredVisibilitySeconds} continuous seconds</strong></div><div><Eye size={20} /><span>Qualifying performance</span><strong>{mission.minimumQualifyingViews.toLocaleString()} views</strong></div><div><UsersRound size={20} /><span>Creator capacity</span><strong>{availability.remaining} spots remaining</strong></div></div></section>
        <section className="detail-section detail-split"><div><ShieldCheck size={25} /><h2>Keep it brand safe</h2><p>{mission.creativeRestrictions || "Follow the approved brief and avoid misleading product claims."}</p></div><div><BadgeCheck size={25} /><h2>Disclose it clearly</h2><p>{mission.requiredDisclosure}</p></div></section>
        <section className="detail-section"><h2>How earnings work</h2><div className="payout-tiers">{mission.payoutTiers.map(tier => <div key={tier.views}><span>{tier.views.toLocaleString()} verified views</span><strong>{formatMoney(tier.amountMinor, mission.currency)}</strong></div>)}</div><p className="detail-note">Only the highest achieved tier is paid. Metrics are source-labeled and reviewed before payout eligibility is confirmed.</p></section>
        <section className="detail-section"><h2>Your timeline</h2><div className="timeline"><div><CalendarDays /><span>Applications close</span><strong>{formatMissionDate(mission.applicationDeadline)}</strong></div><div><CalendarDays /><span>Content published by</span><strong>{formatMissionDate(mission.publicationDeadline)}</strong></div><div><CalendarDays /><span>Performance measured through</span><strong>{formatMissionDate(mission.measurementDeadline)}</strong></div></div></section>
      </div>
      <aside className="mission-action-column">
        {mode === "creator" ? <MissionApplicationForm missionId={mission.id} termsVersion={mission.termsVersion} enabled={canApply} unavailableReason={unavailableReason} /> : <div className="apply-panel"><div className="apply-panel-heading"><CircleDollarSign size={24} /><div><span>Campaign commitment</span><p>{formatMoney(mission.committedBudgetMinor, mission.currency)} of {formatMoney(mission.budgetMinor, mission.currency)} reserved.</p></div></div><Link className="button acid" href="/brand/missions/new">Create another mission</Link></div>}
      </aside>
    </div>
  </div>;
}

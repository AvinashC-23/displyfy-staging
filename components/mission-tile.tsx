import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays } from "lucide-react";
import { formatMoney } from "@/lib/domain";
import { formatMissionDate, getMissionAvailability, getMissionImage } from "@/lib/mission-presentation";
import type { Mission } from "@/lib/types";

export function MissionTile({ mission, hrefBase = "/creator/missions", priority = false }: { mission: Mission; hrefBase?: string; priority?: boolean }) {
  const availability = getMissionAvailability(mission);
  return <Link className="mission-tile" href={`${hrefBase}/${mission.id}`} aria-label={`View ${mission.name}`}>
    <div className="mission-tile-media">
      <Image src={getMissionImage(mission)} alt="" fill priority={priority} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
      <span className={`availability ${availability.available ? "is-open" : ""}`}>{availability.label}</span>
      <span className="tile-category">{mission.category}</span>
    </div>
    <div className="mission-tile-body">
      <div className="mission-tile-brand">{mission.brandVerified && <BadgeCheck size={16} aria-hidden />}<span>{mission.brandName}</span></div>
      <h3>{mission.name}</h3>
      <p>{mission.objective}</p>
      <div className="mission-tile-meta">
        <span><strong>{formatMoney(mission.maxPayoutMinor, mission.currency)}</strong> maximum</span>
        <span><CalendarDays size={15} aria-hidden /> Apply by {formatMissionDate(mission.applicationDeadline)}</span>
      </div>
      <span className="tile-link">See mission details <ArrowUpRight size={17} aria-hidden /></span>
    </div>
  </Link>;
}

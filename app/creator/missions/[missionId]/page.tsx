import { notFound } from "next/navigation";
import { MissionDetail } from "@/components/mission-detail";
import { WorkspaceNav } from "@/components/workspace-nav";
import { isDemoMode } from "@/lib/config";
import { canCreatorViewMissionDetails, isCreatorEligibleForMission } from "@/lib/domain";
import { getMissionAvailability } from "@/lib/mission-presentation";
import { getRepositoryForRole } from "@/lib/repository";

export default async function Page({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const repo = await getRepositoryForRole("creator");
  const [missions, creators] = await Promise.all([repo.listMissions(), repo.listCreators()]);
  const mission = missions.find(item => item.id === missionId);
  const creator = creators.find(item => item.status === "approved") ?? creators[0];
  if (!mission || !creator || !canCreatorViewMissionDetails(creator, mission)) notFound();
  const availability = getMissionAvailability(mission);
  const eligible = isCreatorEligibleForMission(creator, mission);
  const permitted = mission.accessMode === "open" || mission.permittedCreatorIds.includes(creator.id);
  const beforeDeadline = isDemoMode() || new Date(mission.applicationDeadline) >= new Date();
  const canApply = availability.available && eligible && permitted && beforeDeadline;
  const reason = !eligible ? "This mission does not currently match your creator profile." : !permitted ? "This mission is invitation only." : !beforeDeadline ? "Applications have closed." : undefined;
  return <><div className="workspace-shell workspace-nav-only"><WorkspaceNav role="creator" /></div><MissionDetail mission={mission} mode="creator" canApply={canApply} unavailableReason={reason} /></>;
}

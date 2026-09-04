import { notFound } from "next/navigation";
import { MissionDetail } from "@/components/mission-detail";
import { WorkspaceNav } from "@/components/workspace-nav";
import { getRepositoryForRole } from "@/lib/repository";

export default async function Page({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const repo = await getRepositoryForRole("brand");
  const missions = await repo.listMissions();
  const mission = missions.find(item => item.id === missionId);
  if (!mission) notFound();
  return <><div className="workspace-shell workspace-nav-only"><WorkspaceNav role="brand" current="missions" /></div><MissionDetail mission={mission} mode="brand" /></>;
}

import { HomeExperience } from "@/components/home-experience";
import { demoMissions } from "@/lib/demo-data";
import { formatMoney } from "@/lib/domain";

export default function HomePage() {
  const mission = demoMissions[0];
  return <HomeExperience mission={{
    id: mission.id,
    brandName: mission.brandName,
    name: mission.name,
    objective: mission.objective,
    accessMode: mission.accessMode,
    requiredVisibilitySeconds: mission.requiredVisibilitySeconds,
    minimumQualifyingViews: mission.minimumQualifyingViews.toLocaleString(),
    maximumPayout: formatMoney(mission.maxPayoutMinor, mission.currency)
  }} />;
}

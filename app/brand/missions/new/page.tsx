import type { Metadata } from "next";
import { MissionForm } from "@/components/forms/mission-form";
import { WorkspaceNav } from "@/components/workspace-nav";

export const metadata: Metadata = { title: "Create a mission" };

export default function Page() {
  return <div className="workspace-shell mission-builder-page"><WorkspaceNav role="brand" /><header className="catalog-heading"><p className="workspace-kicker">New creator mission</p><h1>Turn the campaign into a clear creative ask.</h1><p>Define the placement, creator fit, timing, disclosure, and payout before submitting it for review.</p></header><MissionForm /></div>;
}

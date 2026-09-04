import type { Metadata } from "next";
import { AdminActionForm } from "@/components/forms/admin-action-form";
import { StatusPill } from "@/components/status-pill";
import { WorkspaceNav } from "@/components/workspace-nav";
import { formatMoney } from "@/lib/domain";
import { getRepositoryForRole } from "@/lib/repository";
import { getAppMode } from "@/lib/config";

export const metadata: Metadata = { title: "Operations review" };

export default async function Page() {
  const mode = getAppMode();
  const repo = await getRepositoryForRole("admin");
  const [creators, missions, submissions, audit] = await Promise.all([repo.listCreators(), repo.listMissions(), repo.listSubmissions(), repo.listAuditEvents()]);
  const creatorReviews = creators.filter(item => item.status === "pending_review");
  const missionReviews = missions.filter(item => ["draft", "submitted_for_review"].includes(item.status));

  return <div className="workspace-shell admin-workspace"><WorkspaceNav role="admin" current="home" />
    <header className="workspace-welcome"><div><p className="workspace-kicker">Operations · {mode} environment</p><h1>Review what needs a decision.</h1><p>Creator safety, mission quality, submission evidence, and payouts remain traceable without turning every screen into a spreadsheet.</p></div><StatusPill status={mode === "demo" ? "MFA required in staging" : "MFA protected"} /></header>
    <section className="review-summary"><article><span>Creator reviews</span><strong>{creatorReviews.length}</strong><p>Applications awaiting a clear decision.</p></article><article><span>Mission reviews</span><strong>{missionReviews.length}</strong><p>Briefs to approve, revise, or publish.</p></article><article><span>Submission reviews</span><strong>{submissions.length}</strong><p>Reels requiring placement and metric checks.</p></article><article><span>Payout eligible</span><strong>{formatMoney(submissions.reduce((sum, item) => sum + item.payoutEligibleMinor, 0), "USD")}</strong><p>Approved value in the manual payout ledger.</p></article></section>
    <div className="admin-columns"><section className="review-queue"><div className="workspace-section-heading"><div><p className="workspace-kicker">Creator queue</p><h2>People waiting for review</h2></div></div>{creators.map(creator => <article className="review-row" key={creator.id}><div><strong>{creator.displayName}</strong><span>@{creator.instagramUsername} · {creator.country} · {creator.averageReelViews.toLocaleString()} average views</span></div><StatusPill status={creator.status} /></article>)}</section><aside className="audit-stream"><p className="workspace-kicker">Recent audit trail</p>{audit.slice(0, 6).map(event => <div key={event.id}><strong>{event.action.replaceAll("_", " ")}</strong><span>{event.actorRole} · {new Date(event.createdAt).toLocaleString()}</span></div>)}</aside></div>
    <section className="review-action"><div><p className="workspace-kicker">Make a reviewed change</p><h2>One action, with context.</h2><p>Choose the record, record the reason, and keep the result in the audit history.</p></div><AdminActionForm creators={creators.map(item => ({ id: item.id, label: `${item.displayName} · ${item.status}` }))} missions={missions.map(item => ({ id: item.id, label: `${item.name} · ${item.status}` }))} submissions={submissions.map(item => ({ id: item.id, label: `${item.reelUrl} · ${item.status}` }))} /></section>
  </div>;
}

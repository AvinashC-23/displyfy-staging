import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Activity, BadgeCheck, CircleDollarSign, Film, History } from "lucide-react";
import { CreatorAccountForm } from "@/components/forms/creator-account-form";
import { StatusPill } from "@/components/status-pill";
import { WorkspaceNav } from "@/components/workspace-nav";
import { getAppMode } from "@/lib/config";
import { demoCreators, demoMissions, demoSubmissions } from "@/lib/demo-data";
import { formatMoney } from "@/lib/domain";
import { authenticatedProfile } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Creator account" };

type ActivityItem = { id: string; title: string; detail: string; status: string };
type RelatedMission = { name: string; brand_name: string };

function relatedMission(value: unknown): RelatedMission | undefined {
  return (Array.isArray(value) ? value[0] : value) as RelatedMission | undefined;
}

export default async function Page() {
  const mode = getAppMode();
  let formData;
  let status = "approved";
  let applicationDate = "September 4, 2026";
  let applications: ActivityItem[] = [];
  let submissions: ActivityItem[] = [];
  let payoutTotal = 0;

  if (mode === "demo") {
    const creator = demoCreators[0];
    formData = { email: "maya@example.com", legalName: "Maya Rao", displayName: creator.displayName, phone: "+14155552671", instagramUsername: creator.instagramUsername, instagramProfileUrl: `https://www.instagram.com/${creator.instagramUsername}/`, country: creator.country as "US", categories: creator.categories as ("lifestyle" | "tech" | "home")[], preferredLanguage: "English", followerCount: creator.followerCount, averageReelViews: creator.averageReelViews };
    applications = [{ id: "demo-application", title: demoMissions[0].name, detail: demoMissions[0].brandName, status: "approved" }];
    submissions = demoSubmissions.map((submission) => ({ id: submission.id, title: demoMissions.find((mission) => mission.id === submission.missionId)?.name ?? "Creator mission", detail: `${submission.views.toLocaleString()} views`, status: submission.status }));
    payoutTotal = demoSubmissions.reduce((total, submission) => total + submission.payoutEligibleMinor, 0);
  } else {
    const auth = await authenticatedProfile("creator");
    if (!auth) redirect("/creator/login?next=/creator/account");
    const [{ data: profile }, { data: creator }] = await Promise.all([
      auth.client.from("profiles").select("display_name,phone_e164,created_at").eq("id", auth.user.id).single(),
      auth.client.from("creator_profiles").select("id,legal_name,display_name,instagram_username,instagram_profile_url,country,categories,preferred_language,follower_count,average_reel_views,status").eq("user_id", auth.user.id).single()
    ]);
    if (!profile || !creator) redirect("/creator/login?error=account-unavailable");
    const [{ data: creatorApplications }, { data: missionApplications }, { data: creatorSubmissions }, { data: payouts }] = await Promise.all([
      auth.client.from("creator_applications").select("submitted_at").eq("creator_id", creator.id).order("submitted_at", { ascending: false }).limit(1),
      auth.client.from("mission_applications").select("id,status,created_at,mission:missions(name,brand_name)").eq("creator_id", creator.id).order("created_at", { ascending: false }).limit(20),
      auth.client.from("creator_submissions").select("id,status,views,mission:missions(name,brand_name)").eq("creator_id", creator.id).order("created_at", { ascending: false }).limit(20),
      auth.client.from("payout_records").select("amount_minor,status").eq("creator_id", creator.id)
    ]);
    formData = { email: auth.user.email ?? "", legalName: creator.legal_name, displayName: creator.display_name, phone: profile.phone_e164 ?? "", instagramUsername: creator.instagram_username, instagramProfileUrl: creator.instagram_profile_url, country: creator.country, categories: creator.categories, preferredLanguage: creator.preferred_language, followerCount: Number(creator.follower_count), averageReelViews: Number(creator.average_reel_views) };
    status = creator.status;
    applicationDate = new Date(creatorApplications?.[0]?.submitted_at ?? profile.created_at).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" });
    applications = (missionApplications ?? []).map((item) => { const mission = relatedMission(item.mission); return { id: item.id, title: mission?.name ?? "Creator mission", detail: mission?.brand_name ?? "Brand mission", status: item.status }; });
    submissions = (creatorSubmissions ?? []).map((item) => { const mission = relatedMission(item.mission); return { id: item.id, title: mission?.name ?? "Creator mission", detail: `${Number(item.views).toLocaleString()} views`, status: item.status }; });
    payoutTotal = (payouts ?? []).filter((item) => ["eligible", "processing", "paid"].includes(item.status)).reduce((total, item) => total + Number(item.amount_minor), 0);
  }

  return <div className="workspace-shell creator-account-page">
    <WorkspaceNav role="creator" />
    <header className="account-heading"><div><p className="workspace-kicker">Creator account</p><h1>Your profile, history, and payout trail.</h1><p>Keep your eligibility details current and revisit the work already connected to your account.</p></div><StatusPill status={status} /></header>
    <section className="account-summary" aria-label="Account summary">
      <article><BadgeCheck size={20} /><span>Member since</span><strong>{applicationDate}</strong></article>
      <article><Activity size={20} /><span>Mission applications</span><strong>{applications.length}</strong></article>
      <article><Film size={20} /><span>Reels submitted</span><strong>{submissions.length}</strong></article>
      <article><CircleDollarSign size={20} /><span>Eligible and paid</span><strong>{formatMoney(payoutTotal, "USD")}</strong></article>
    </section>
    <div className="account-layout">
      <section className="account-editor"><div className="account-section-title"><p className="workspace-kicker">Profile details</p><h2>Edit what brands use for matching.</h2></div><CreatorAccountForm {...formData} /></section>
      <aside className="account-history"><div className="account-section-title"><History size={20} /><p className="workspace-kicker">Past activity</p><h2>Your Displyfy record.</h2></div><div className="account-history-group"><h3>Mission applications</h3>{applications.length ? applications.map((item) => <article key={item.id}><div><strong>{item.title}</strong><span>{item.detail}</span></div><StatusPill status={item.status} /></article>) : <p>No mission applications yet.</p>}</div><div className="account-history-group"><h3>Submitted Reels</h3>{submissions.length ? submissions.map((item) => <article key={item.id}><div><strong>{item.title}</strong><span>{item.detail}</span></div><StatusPill status={item.status} /></article>) : <p>No submitted Reels yet.</p>}</div></aside>
    </div>
  </div>;
}

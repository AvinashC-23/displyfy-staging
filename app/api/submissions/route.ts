import { NextRequest } from "next/server";
import { reelSubmissionSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { canSubmitToMission } from "@/lib/domain";
import { demoCreators, demoMissions, demoSubmissions } from "@/lib/demo-data";
import { authenticatedProfile, createAdminSupabase, isPersistentMode } from "@/lib/supabase/server";
import type { CreatorProfile, Mission } from "@/lib/types";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 10);
  if (blocked) return blocked;
  const auth = isPersistentMode() ? await authenticatedProfile("creator") : null;
  if (isPersistentMode() && !auth) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = await parseJson(request, reelSubmissionSchema);
  if ("response" in parsed) return parsed.response;
  if (isPersistentMode()) {
    if (!auth) return Response.json({ error: "Authentication required." }, { status: 401 });
    const admin = createAdminSupabase();
    const [{ data: creatorRow }, { data: missionRow }, { data: financialRow }, { data: tiers }, { data: duplicate }] = await Promise.all([
      admin.from("creator_profiles").select("id,instagram_username,country,categories,follower_count,average_reel_views,status").eq("user_id", auth.user.id).single(),
      admin.from("missions").select("*").eq("id", parsed.data.missionId).single(),
      admin.from("mission_financials").select("budget_minor,committed_budget_minor").eq("mission_id", parsed.data.missionId).single(),
      admin.from("mission_payout_tiers").select("views,amount_minor").eq("mission_id", parsed.data.missionId).order("views"),
      admin.from("creator_submissions").select("id").eq("reel_url", parsed.data.reelUrl).maybeSingle()
    ]);
    if (!creatorRow || !missionRow || !financialRow || !tiers) return Response.json({ error: "Mission is unavailable." }, { status: 404 });
    const [{ data: permission }, { data: application }] = await Promise.all([
      admin.from("mission_creator_permissions").select("creator_id").eq("mission_id", missionRow.id).eq("creator_id", creatorRow.id).is("revoked_at", null).not("approved_by_admin_at", "is", null).maybeSingle(),
      admin.from("mission_applications").select("id").eq("mission_id", missionRow.id).eq("creator_id", creatorRow.id).eq("status", "approved").maybeSingle()
    ]);
    const creator: CreatorProfile = { id: creatorRow.id, displayName: "Creator", instagramUsername: creatorRow.instagram_username, country: creatorRow.country, categories: creatorRow.categories, followerCount: creatorRow.follower_count, averageReelViews: creatorRow.average_reel_views, status: creatorRow.status };
    const mission: Mission = { id: missionRow.id, brandName: missionRow.brand_name, brandVerified: missionRow.brand_verified, name: missionRow.name, objective: missionRow.objective, category: missionRow.category, eligibleCountries: missionRow.eligible_countries, accessMode: missionRow.access_mode, visibility: missionRow.visibility, participationApproval: missionRow.participation_approval, placementType: missionRow.placement_type, placementInstructions: missionRow.placement_instructions, requiredVisibilitySeconds: missionRow.required_visibility_seconds, creativeRestrictions: missionRow.creative_restrictions, requiredDisclosure: missionRow.required_disclosure, applicationDeadline: missionRow.application_deadline, publicationDeadline: missionRow.publication_deadline, measurementDeadline: missionRow.measurement_deadline, minimumQualifyingViews: missionRow.minimum_qualifying_views, payoutTiers: tiers.map(t => ({ views: t.views, amountMinor: t.amount_minor })), maxPayoutMinor: missionRow.max_payout_minor, currency: missionRow.currency, capacity: missionRow.capacity, reservedSlots: missionRow.reserved_slots, budgetMinor: financialRow.budget_minor, committedBudgetMinor: financialRow.committed_budget_minor, status: missionRow.status, permittedCreatorIds: permission ? [creatorRow.id] : [], termsVersion: missionRow.terms_version };
    const gate = canSubmitToMission({ creator, mission, hasApprovedApplication: Boolean(application), acceptedTermsVersion: parsed.data.acceptedTermsVersion, existingSubmissionUrls: new Set(duplicate ? [parsed.data.reelUrl] : []), reelUrl: parsed.data.reelUrl, now: new Date() });
    if (!gate.allowed) return Response.json({ error: gate.reason }, { status: 403 });
    await admin.from("mission_term_acceptances").upsert({ mission_id: mission.id, creator_id: creator.id, terms_version: mission.termsVersion }, { onConflict: "mission_id,creator_id,terms_version" });
    const { data: submission, error } = await admin.from("creator_submissions").insert({ creator_id: creator.id, mission_id: mission.id, reel_url: parsed.data.reelUrl, publication_date: parsed.data.publicationDate, caption: parsed.data.caption, creator_notes: parsed.data.notes, disclosure_confirmed: true, status: "submitted", metric_source: "creator_supplied" }).select("id").single();
    if (error || !submission) return Response.json({ error: "Submission could not be completed." }, { status: 500 });
    await admin.from("audit_events").insert({ actor_id: auth.user.id, actor_role: "creator", action: "submission.created", entity_type: "creator_submission", entity_id: submission.id });
    return Response.json({ message: "Reel submitted for administrator review.", submissionStatus: "submitted", id: submission.id }, { status: 201 });
  }
  const creator = demoCreators.find(item => item.status === "approved");
  const mission = demoMissions.find(item => item.id === parsed.data.missionId);
  if (!creator || !mission) return Response.json({ error: "Mission is unavailable." }, { status: 404 });
  const gate = canSubmitToMission({ creator, mission, hasApprovedApplication: true, acceptedTermsVersion: mission.termsVersion, existingSubmissionUrls: new Set(demoSubmissions.map(item => item.reelUrl)), reelUrl: parsed.data.reelUrl, now: new Date("2026-09-04T12:00:00Z") });
  if (!gate.allowed) return Response.json({ error: gate.reason }, { status: 403 });
  return demoAccepted("Reel passed server authorization and validation in local demo mode.", { submissionStatus: "submitted" });
}

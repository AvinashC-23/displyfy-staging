import { NextRequest } from "next/server";
import { missionSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { authenticatedProfile, createAdminSupabase, isPersistentMode } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 10);
  if (blocked) return blocked;
  const auth = isPersistentMode() ? await authenticatedProfile("brand") : null;
  if (isPersistentMode() && !auth) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = await parseJson(request, missionSchema);
  if ("response" in parsed) return parsed.response;
  if (isPersistentMode()) {
    if (!auth) return Response.json({ error: "Authentication required." }, { status: 401 });
    const { data: member } = await auth.client.from("brand_members").select("organization_id").eq("user_id", auth.user.id).limit(1).maybeSingle();
    if (!member) return Response.json({ error: "Brand access is unavailable." }, { status: 403 });
    const admin = createAdminSupabase();
    const { data: organization } = await admin.from("brand_organizations").select("verified_at,suspended_at").eq("id", member.organization_id).single();
    if (!organization?.verified_at || organization.suspended_at) return Response.json({ error: "Brand access is unavailable." }, { status: 403 });
    const { data: mission, error } = await admin.from("missions").insert({ organization_id: member.organization_id, brand_name: parsed.data.brandName, brand_verified: true, name: parsed.data.name, objective: parsed.data.objective, category: parsed.data.categories[0], eligible_countries: parsed.data.eligibleCountries, access_mode: parsed.data.accessMode, visibility: parsed.data.visibility, participation_approval: parsed.data.participationApproval, placement_type: parsed.data.placementType, placement_instructions: parsed.data.placementInstructions, required_visibility_seconds: parsed.data.requiredVisibilitySeconds, creative_restrictions: parsed.data.prohibitedContent, required_disclosure: parsed.data.requiredDisclosure, application_deadline: parsed.data.applicationDeadline, publication_deadline: parsed.data.publicationDeadline, measurement_deadline: parsed.data.measurementDeadline, minimum_qualifying_views: parsed.data.minimumQualifyingViews, max_payout_minor: parsed.data.tierTwoPayoutMinor, currency: parsed.data.currency, capacity: parsed.data.maxCreators, status: "submitted_for_review", terms_version: new Date().toISOString() }).select("id").single();
    if (error || !mission) return Response.json({ error: "Mission could not be created." }, { status: 500 });
    const [{ error: financesError }, { error: tiersError }] = await Promise.all([
      admin.from("mission_financials").insert({ mission_id: mission.id, budget_minor: parsed.data.totalBudgetMinor }),
      admin.from("mission_payout_tiers").insert([{ mission_id: mission.id, views: parsed.data.tierOneViews, amount_minor: parsed.data.tierOnePayoutMinor }, { mission_id: mission.id, views: parsed.data.tierTwoViews, amount_minor: parsed.data.tierTwoPayoutMinor }])
    ]);
    if (financesError || tiersError) { await admin.from("missions").delete().eq("id", mission.id); return Response.json({ error: "Mission could not be created." }, { status: 500 }); }
    await admin.from("audit_events").insert({ actor_id: auth.user.id, actor_role: "brand", action: "mission.submitted_for_review", entity_type: "mission", entity_id: mission.id });
    return Response.json({ message: "Mission submitted for administrator review.", missionStatus: "submitted_for_review", id: mission.id }, { status: 201 });
  }
  return demoAccepted("Mission validated and staged for administrator review in local demo mode.", { missionStatus: "submitted_for_review" });
}

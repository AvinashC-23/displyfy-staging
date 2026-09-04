import { NextRequest } from "next/server";
import { missionApplicationSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { authenticatedProfile, createAdminSupabase, isPersistentMode } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 10);
  if (blocked) return blocked;
  const auth = isPersistentMode() ? await authenticatedProfile("creator") : null;
  if (isPersistentMode() && !auth) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = await parseJson(request, missionApplicationSchema);
  if ("response" in parsed) return parsed.response;

  if (!isPersistentMode()) {
    return demoAccepted("Application accepted in local demo mode. No mission capacity was reserved.", { applicationStatus: "approved" });
  }

  if (!auth) return Response.json({ error: "Authentication required." }, { status: 401 });
  const admin = createAdminSupabase();
  const [{ data: creator }, { data: mission }, { data: finances }] = await Promise.all([
    admin.from("creator_profiles").select("id,status,country,categories").eq("user_id", auth.user.id).single(),
    admin.from("missions").select("id,status,access_mode,participation_approval,eligible_countries,category,application_deadline,capacity,reserved_slots,max_payout_minor,terms_version").eq("id", parsed.data.missionId).single(),
    admin.from("mission_financials").select("budget_minor,committed_budget_minor").eq("mission_id", parsed.data.missionId).single()
  ]);
  if (!creator || !mission || !finances) return Response.json({ error: "Mission is unavailable." }, { status: 404 });
  if (creator.status !== "approved") return Response.json({ error: "Your creator profile must be approved first." }, { status: 403 });
  if (mission.status !== "live" || new Date(mission.application_deadline) < new Date()) return Response.json({ error: "Applications are closed." }, { status: 403 });
  if (!mission.eligible_countries.includes(creator.country) || !creator.categories.includes(mission.category)) return Response.json({ error: "This mission does not match your current profile." }, { status: 403 });
  if (mission.participation_approval === "automatic_for_eligible_approved_creators" && (mission.reserved_slots >= mission.capacity || finances.committed_budget_minor + mission.max_payout_minor > finances.budget_minor)) return Response.json({ error: "This mission is fully booked." }, { status: 409 });
  if (mission.terms_version !== parsed.data.acceptedTermsVersion) return Response.json({ error: "The mission terms have changed. Refresh and review them again." }, { status: 409 });

  if (mission.access_mode === "restricted") {
    const { data: permission } = await admin.from("mission_creator_permissions").select("id").eq("mission_id", mission.id).eq("creator_id", creator.id).is("revoked_at", null).not("approved_by_admin_at", "is", null).maybeSingle();
    if (!permission) return Response.json({ error: "This mission is invitation only." }, { status: 403 });
  }

  const { error } = await auth.client.rpc("reserve_mission_slot", { target_mission: mission.id, accepted_terms: mission.terms_version });
  if (error) return Response.json({ error: "The mission could not be reserved. It may have just filled." }, { status: 409 });
  const approved = mission.participation_approval === "automatic_for_eligible_approved_creators";
  return Response.json({ message: approved ? "You are in. Review the brief and plan your Reel." : "Application submitted for review.", applicationStatus: approved ? "approved" : "pending" }, { status: 201 });
}

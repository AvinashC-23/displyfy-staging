import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !publishableKey || !secretKey) throw new Error("Run with staging .env.local loaded.");

const service = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
const creatorClient = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
const suffix = randomUUID();
const email = `security-smoke-${suffix}@example.com`;
const password = `${randomBytes(24).toString("base64url")}Aa1!`;
let userId;
let creatorId;
let missionId;

async function requireData(operation, label) {
  const result = await operation;
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}

try {
  const organizations = await requireData(service.from("brand_organizations").select("id").limit(1), "load test organization");
  assert.equal(organizations.length, 1, "Synthetic staging organization is missing.");

  const createdUser = await requireData(service.auth.admin.createUser({ email, password, email_confirm: true }), "create temporary user");
  userId = createdUser.user.id;
  await requireData(service.from("profiles").insert({ id: userId, role: "creator", display_name: "Security Smoke Creator" }), "create temporary profile");
  const creator = await requireData(service.from("creator_profiles").insert({
    user_id: userId,
    legal_name: "Synthetic Test Creator",
    display_name: "Security Smoke Creator",
    instagram_username: `security_smoke_${suffix.replaceAll("-", "")}`,
    instagram_profile_url: "https://www.instagram.com/security_smoke/",
    country: "IN",
    categories: ["lifestyle"],
    preferred_language: "English",
    average_reel_views: 10_000,
    status: "approved"
  }).select("id").single(), "create temporary creator");
  creatorId = creator.id;

  const mission = await requireData(service.from("missions").insert({
    organization_id: organizations[0].id,
    brand_name: "Synthetic Security Brand",
    brand_verified: true,
    name: "Temporary RLS reservation test",
    objective: "Validate staging authorization controls.",
    category: "lifestyle",
    eligible_countries: ["IN"],
    access_mode: "open",
    visibility: "registered_creators",
    participation_approval: "automatic_for_eligible_approved_creators",
    placement_type: "Synthetic product placement",
    placement_instructions: "Synthetic test only.",
    required_visibility_seconds: 5,
    creative_restrictions: "Synthetic test only.",
    required_disclosure: "#ad",
    application_deadline: new Date(Date.now() + 86_400_000).toISOString(),
    publication_deadline: new Date(Date.now() + 172_800_000).toISOString(),
    measurement_deadline: new Date(Date.now() + 259_200_000).toISOString(),
    minimum_qualifying_views: 5_000,
    max_payout_minor: 10_000,
    currency: "INR",
    capacity: 1,
    status: "live",
    terms_version: "security-smoke-v1"
  }).select("id").single(), "create temporary mission");
  missionId = mission.id;
  await requireData(service.from("mission_financials").insert({ mission_id: missionId, budget_minor: 10_000 }), "create temporary finances");

  const anonymous = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const anonymousMission = await requireData(anonymous.from("missions").select("id").eq("id", missionId), "anonymous mission query");
  assert.equal(anonymousMission.length, 0, "Anonymous user could see a registered-creator mission.");

  await requireData(creatorClient.auth.signInWithPassword({ email, password }), "sign in temporary creator");
  const mfaEnrollment = await requireData(
    creatorClient.auth.mfa.enroll({ factorType: "totp", friendlyName: "Staging security smoke" }),
    "enroll temporary TOTP factor"
  );
  assert.ok(mfaEnrollment.id, "TOTP enrollment did not return a factor ID.");
  assert.ok(mfaEnrollment.totp?.qr_code, "TOTP enrollment did not return a QR code.");
  const visibleMission = await requireData(creatorClient.from("missions").select("id").eq("id", missionId), "creator mission query");
  assert.equal(visibleMission.length, 1, "Approved creator could not see the eligible mission.");
  const finances = await requireData(creatorClient.from("mission_financials").select("mission_id").eq("mission_id", missionId), "creator finance query");
  assert.equal(finances.length, 0, "Creator could see protected mission finances.");

  await requireData(creatorClient.rpc("reserve_mission_slot", { target_mission: missionId, accepted_terms: "security-smoke-v1" }), "reserve mission slot");
  const reservation = await requireData(service.from("missions").select("reserved_slots").eq("id", missionId).single(), "verify reservation");
  assert.equal(reservation.reserved_slots, 1, "Reservation did not atomically claim capacity.");
  const duplicate = await creatorClient.rpc("reserve_mission_slot", { target_mission: missionId, accepted_terms: "security-smoke-v1" });
  assert.ok(duplicate.error, "Duplicate reservation unexpectedly succeeded.");
  const privileged = await creatorClient.rpc("perform_admin_action", { target_type: "mission", target_id: missionId, target_action: "pause" });
  assert.ok(privileged.error, "Creator session unexpectedly executed an administrator action.");

  console.log("Staging security smoke passed: MFA enrollment, visibility, finance isolation, reservation locking, and privileged RPC denial.");
} finally {
  if (missionId) {
    await service.from("mission_term_acceptances").delete().eq("mission_id", missionId);
    await service.from("mission_applications").delete().eq("mission_id", missionId);
    await service.from("missions").delete().eq("id", missionId);
  }
  if (creatorId) {
    await service.from("creator_applications").delete().eq("creator_id", creatorId);
    await service.from("creator_profiles").delete().eq("id", creatorId);
  }
  if (userId) {
    await service.from("profiles").delete().eq("id", userId);
    await service.auth.admin.deleteUser(userId);
  }
}

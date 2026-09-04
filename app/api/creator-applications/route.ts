import { NextRequest } from "next/server";
import { creatorApplicationSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { normalizeInstagramProfileUrl, normalizeInstagramUsername } from "@/lib/domain";
import { createClient } from "@supabase/supabase-js";
import { createAdminSupabase, isPersistentMode } from "@/lib/supabase/server";
import { getProviders } from "@/lib/providers";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 5, 10 * 60_000);
  if (blocked) return blocked;
  const parsed = await parseJson(request, creatorApplicationSchema);
  if ("response" in parsed) return parsed.response;
  const normalized = { instagramUsername: normalizeInstagramUsername(parsed.data.instagramUsername), instagramProfileUrl: normalizeInstagramProfileUrl(parsed.data.instagramProfileUrl) };
  if (isPersistentMode()) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !publishableKey) return Response.json({ error: "Application service is temporarily unavailable." }, { status: 503 });
    const auth = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: signUp, error: signUpError } = await auth.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { display_name: parsed.data.displayName }, emailRedirectTo: `${request.nextUrl.origin}/auth/callback?next=/creator/dashboard` } });
    if (signUpError || !signUp.user) return Response.json({ message: "If the application can be accepted, verification instructions will be sent." }, { status: 202 });
    const admin = createAdminSupabase();
    const { error: profileError } = await admin.from("profiles").insert({ id: signUp.user.id, role: "creator", display_name: parsed.data.displayName, phone_e164: parsed.data.phone });
    if (profileError) { await admin.auth.admin.deleteUser(signUp.user.id); return Response.json({ error: "Application could not be completed." }, { status: 500 }); }
    const { data: creator, error: creatorError } = await admin.from("creator_profiles").insert({ user_id: signUp.user.id, legal_name: parsed.data.legalName, display_name: parsed.data.displayName, instagram_username: normalized.instagramUsername, instagram_profile_url: normalized.instagramProfileUrl, country: parsed.data.country, categories: [parsed.data.primaryCategory, ...parsed.data.secondaryCategories], preferred_language: parsed.data.preferredLanguage, average_reel_views: parsed.data.averageReelViews, status: "pending_review" }).select("id").single();
    if (creatorError || !creator) { await admin.from("profiles").delete().eq("id", signUp.user.id); await admin.auth.admin.deleteUser(signUp.user.id); return Response.json({ error: "Application could not be completed." }, { status: 500 }); }
    const { error: applicationError } = await admin.from("creator_applications").insert({ creator_id: creator.id, content_description: parsed.data.contentDescription, follower_range: parsed.data.followerRange, terms_version: "2026-09-04", privacy_version: "2026-09-04", disclosure_version: "2026-09-04", notification_consent_at: new Date().toISOString() });
    if (applicationError) { await admin.from("creator_profiles").delete().eq("id", creator.id); await admin.from("profiles").delete().eq("id", signUp.user.id); await admin.auth.admin.deleteUser(signUp.user.id); return Response.json({ error: "Application could not be completed." }, { status: 500 }); }
    const verification = await getProviders().sms.startPhoneVerification(parsed.data.phone);
    return Response.json({ message: "Application received. Verify your email and phone to continue.", applicationStatus: "pending_review", phoneVerificationStarted: verification.ok, externallyDelivered: verification.ok && !verification.simulated }, { status: 201 });
  }
  return demoAccepted("Application validated in local demo mode. No account, email, or SMS was created.", { applicationStatus: "pending_review", normalized });
}

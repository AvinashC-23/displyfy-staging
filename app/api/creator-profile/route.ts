import { NextRequest } from "next/server";
import { creatorProfileUpdateSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { authenticatedProfile, isPersistentMode } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 12);
  if (blocked) return blocked;

  const auth = isPersistentMode() ? await authenticatedProfile("creator") : null;
  if (isPersistentMode() && !auth) return Response.json({ error: "Authentication required." }, { status: 401 });

  const parsed = await parseJson(request, creatorProfileUpdateSchema);
  if ("response" in parsed) return parsed.response;
  if (!isPersistentMode()) return demoAccepted("Your creator profile was updated in local demo mode.");
  if (!auth) return Response.json({ error: "Authentication required." }, { status: 401 });

  const values = parsed.data;
  const { error } = await auth.client.rpc("update_creator_account", {
    p_legal_name: values.legalName,
    p_display_name: values.displayName,
    p_phone_e164: values.phone,
    p_instagram_username: values.instagramUsername.replace(/^@/, "").toLowerCase(),
    p_instagram_profile_url: values.instagramProfileUrl,
    p_country: values.country,
    p_categories: values.categories,
    p_preferred_language: values.preferredLanguage,
    p_follower_count: values.followerCount,
    p_average_reel_views: values.averageReelViews
  });

  if (error?.code === "23505") return Response.json({ error: "That Instagram username is already connected to another account." }, { status: 409 });
  if (error) return Response.json({ error: "Your profile could not be updated." }, { status: 400 });
  return Response.json({ message: "Your creator profile is up to date." });
}

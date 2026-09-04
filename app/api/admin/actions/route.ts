import { NextRequest } from "next/server";
import { adminActionSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { getProviders } from "@/lib/providers";
import { authenticatedProfile, createAdminSupabase, isPersistentMode } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 30);
  if (blocked) return blocked;
  const auth = isPersistentMode() ? await authenticatedProfile("admin", true) : null;
  if (isPersistentMode() && !auth) return Response.json({ error: "Administrator MFA is required." }, { status: 403 });
  const parsed = await parseJson(request, adminActionSchema);
  if ("response" in parsed) return parsed.response;
  if (!isPersistentMode()) return demoAccepted("Admin action validated in local demo mode. Seed data was not changed.", { action: parsed.data.action });

  if (!auth) return Response.json({ error: "Administrator MFA is required." }, { status: 403 });
  const { data: status, error } = await auth.client.rpc("perform_admin_action", {
    target_type: parsed.data.entityType,
    target_id: parsed.data.entityId,
    target_action: parsed.data.action,
    action_reason: parsed.data.reason || null,
    verified_views: parsed.data.views ?? null,
    payment_reference: parsed.data.externalReference ?? null
  });
  if (error) return Response.json({ error: "That action is not valid for the record's current status." }, { status: 409 });

  if (parsed.data.entityType === "creator" && parsed.data.action === "approve") {
    await sendCreatorApproval(parsed.data.entityId);
  }

  return Response.json({ message: "Action completed and recorded in the audit log.", status });
}

async function sendCreatorApproval(creatorId: string) {
  const admin = createAdminSupabase();
  const { data: creator } = await admin.from("creator_profiles").select("user_id").eq("id", creatorId).single();
  if (!creator) return;
  const { data } = await admin.auth.admin.getUserById(creator.user_id);
  const email = data.user?.email;
  if (!email) return;

  const notificationId = crypto.randomUUID();
  const idempotencyKey = `creator-approved:${creatorId}`;
  const { error } = await admin.from("notifications").upsert({ id: notificationId, profile_id: creator.user_id, provider: "resend", template: "creator_approved", destination_redacted: "email:redacted", status: "queued", idempotency_key: idempotencyKey }, { onConflict: "idempotency_key", ignoreDuplicates: true });
  if (error) return;
  const sent = await getProviders().email.sendTransactionalEmail({ to: email, subject: "Your Displyfy creator account is approved", html: "<p>Your Displyfy creator account has been approved. You can now sign in and explore available missions.</p>", idempotencyKey });
  await admin.from("notifications").update({ status: sent.ok ? "sent" : "failed", attempt_count: 1, last_attempt_at: new Date().toISOString(), provider_reference: sent.providerReference, failure_category: sent.failureCategory }).eq("id", notificationId);
}

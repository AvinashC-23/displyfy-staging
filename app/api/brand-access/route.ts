import { NextRequest } from "next/server";
import { brandAccessSchema } from "@/lib/schemas";
import { demoAccepted, enforceRateLimit, enforceSameOrigin, parseJson } from "@/lib/http";
import { createAdminSupabase, isPersistentMode } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? enforceRateLimit(request, 5, 10 * 60_000);
  if (blocked) return blocked;
  const parsed = await parseJson(request, brandAccessSchema);
  if ("response" in parsed) return parsed.response;
  if (isPersistentMode()) {
    const admin = createAdminSupabase();
    const { error } = await admin.from("brand_access_requests").insert({ contact_name: parsed.data.contactName, job_title: parsed.data.jobTitle, company_name: parsed.data.companyName, company_website: parsed.data.companyWebsite, work_email: parsed.data.workEmail, phone_e164: parsed.data.phone, country: parsed.data.country, estimated_budget: parsed.data.estimatedBudget, campaign_objective: parsed.data.campaignObjective, message: parsed.data.message, status: "pending_review" });
    if (error) return Response.json({ error: "Request could not be completed." }, { status: 500 });
    return Response.json({ message: "Your access request is under review.", requestStatus: "pending_review" }, { status: 201 });
  }
  return demoAccepted("Brand request validated in local demo mode. No invitation or notification was sent.", { requestStatus: "pending_review" });
}

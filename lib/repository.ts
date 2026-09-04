import type { SupabaseClient } from "@supabase/supabase-js";
import { demoAuditEvents, demoCreators, demoMissions, demoSubmissions } from "./demo-data";
import type { AuditEvent, CreatorProfile, Mission, Submission } from "./types";
import { authenticatedProfile, isPersistentMode } from "./supabase/server";

export interface DisplyfyRepository {
  listCreators(): Promise<CreatorProfile[]>;
  listMissions(): Promise<Mission[]>;
  listSubmissions(): Promise<Submission[]>;
  listAuditEvents(): Promise<AuditEvent[]>;
}

class DemoRepository implements DisplyfyRepository {
  async listCreators() {
    return demoCreators;
  }

  async listMissions() {
    return demoMissions;
  }

  async listSubmissions() {
    return demoSubmissions;
  }

  async listAuditEvents() {
    return demoAuditEvents;
  }
}

class SupabaseRepository implements DisplyfyRepository {
  constructor(private client: SupabaseClient) {}

  async listCreators() {
    const { data, error } = await this.client
      .from("creator_profiles")
      .select("id, display_name, instagram_username, country, categories, follower_count, average_reel_views, status")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return data.map((row) => ({
      id: row.id,
      displayName: row.display_name,
      instagramUsername: row.instagram_username,
      country: row.country,
      categories: row.categories,
      followerCount: row.follower_count,
      averageReelViews: row.average_reel_views,
      status: row.status
    })) satisfies CreatorProfile[];
  }

  async listMissions() {
    const { data, error } = await this.client
      .from("missions")
      .select(
        "id, brand_name, brand_verified, name, objective, category, eligible_countries, access_mode, visibility, participation_approval, placement_type, placement_instructions, required_visibility_seconds, creative_restrictions, required_disclosure, application_deadline, publication_deadline, measurement_deadline, minimum_qualifying_views, max_payout_minor, currency, capacity, reserved_slots, status, terms_version, financials:mission_financials(budget_minor, committed_budget_minor), payout_tiers:mission_payout_tiers(views, amount_minor), permitted_creators:mission_creator_permissions(creator_id)"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return data.map((row) => {
      const financial = Array.isArray(row.financials) ? row.financials[0] : row.financials;
      return ({
      id: row.id,
      brandName: row.brand_name,
      brandVerified: row.brand_verified,
      name: row.name,
      objective: row.objective,
      category: row.category,
      eligibleCountries: row.eligible_countries,
      accessMode: row.access_mode,
      visibility: row.visibility,
      participationApproval: row.participation_approval,
      placementType: row.placement_type,
      placementInstructions: row.placement_instructions,
      requiredVisibilitySeconds: row.required_visibility_seconds,
      creativeRestrictions: row.creative_restrictions,
      requiredDisclosure: row.required_disclosure,
      applicationDeadline: row.application_deadline,
      publicationDeadline: row.publication_deadline,
      measurementDeadline: row.measurement_deadline,
      minimumQualifyingViews: row.minimum_qualifying_views,
      payoutTiers: row.payout_tiers.map((tier) => ({ views: tier.views, amountMinor: tier.amount_minor })),
      maxPayoutMinor: row.max_payout_minor,
      currency: row.currency,
      capacity: row.capacity,
      reservedSlots: row.reserved_slots,
      budgetMinor: financial?.budget_minor ?? 0,
      committedBudgetMinor: financial?.committed_budget_minor ?? 0,
      status: row.status,
      permittedCreatorIds: row.permitted_creators.map((permission) => permission.creator_id),
      termsVersion: row.terms_version
    });
    }) satisfies Mission[];
  }

  async listSubmissions() {
    const { data, error } = await this.client
      .from("creator_submissions")
      .select("id, creator_id, mission_id, reel_url, caption, publication_date, status, views, metric_source, payout_eligible_minor")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return data.map((row) => ({
      id: row.id,
      creatorId: row.creator_id,
      missionId: row.mission_id,
      reelUrl: row.reel_url,
      caption: row.caption,
      publicationDate: row.publication_date,
      status: row.status,
      views: row.views,
      metricSource: row.metric_source,
      payoutEligibleMinor: row.payout_eligible_minor
    })) satisfies Submission[];
  }

  async listAuditEvents() {
    const { data, error } = await this.client
      .from("audit_events")
      .select("id, actor_role, action, entity_type, entity_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return data.map((row) => ({
      id: row.id,
      actorRole: row.actor_role,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      createdAt: row.created_at
    })) satisfies AuditEvent[];
  }
}

export async function getRepositoryForRole(role: "creator" | "brand" | "admin"): Promise<DisplyfyRepository> {
  if (!isPersistentMode()) return new DemoRepository();
  const auth = await authenticatedProfile(role, role === "admin");
  if (!auth) throw new Error("Authenticated role is required.");
  return new SupabaseRepository(auth.client);
}

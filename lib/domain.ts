import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { CreatorProfile, Mission, PayoutTier } from "./types";
import { isDemoMode } from "./config";

export type SubmissionGateResult =
  | { allowed: true }
  | { allowed: false; reason: string };

export function normalizeInstagramUsername(value: string): string {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function normalizeInstagramProfileUrl(value: string): string {
  const username = normalizeInstagramUsername(new URL(value).pathname.split("/").filter(Boolean)[0] ?? "");
  return `https://www.instagram.com/${username}/`;
}

export function formatMoney(amountMinor: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amountMinor / 100);
}

export function calculatePayoutEligibleMinor(views: number, tiers: PayoutTier[]): number {
  return tiers
    .filter((tier) => views >= tier.views)
    .sort((a, b) => b.views - a.views)[0]?.amountMinor ?? 0;
}

export function isCreatorEligibleForMission(creator: CreatorProfile, mission: Mission): boolean {
  const countryOk = mission.eligibleCountries.includes(creator.country);
  const categoryOk = creator.categories.includes(mission.category);
  const viewOk = creator.averageReelViews >= mission.minimumQualifyingViews * 0.25;
  return creator.status === "approved" && countryOk && categoryOk && viewOk;
}

export function canCreatorViewMissionDetails(creator: CreatorProfile | null, mission: Mission): boolean {
  if (mission.status !== "live") return false;
  if (mission.visibility === "public_summary") return true;
  if (!creator) return false;
  if (mission.visibility === "registered_creators") return creator.status !== "rejected";
  return creator.status === "approved" && mission.permittedCreatorIds.includes(creator.id);
}

export function canSubmitToMission(params: {
  creator: CreatorProfile;
  mission: Mission;
  hasApprovedApplication: boolean;
  acceptedTermsVersion: string | null;
  existingSubmissionUrls: Set<string>;
  reelUrl: string;
  now: Date;
}): SubmissionGateResult {
  const { creator, mission, hasApprovedApplication, acceptedTermsVersion, existingSubmissionUrls, reelUrl, now } = params;

  if (creator.status !== "approved") return { allowed: false, reason: "Creator must be approved." };
  if (mission.status !== "live") return { allowed: false, reason: "Mission is not live." };
  if (new Date(mission.publicationDeadline) < now) return { allowed: false, reason: "Publication deadline has passed." };
  if (!hasApprovedApplication) return { allowed: false, reason: "An approved mission application is required." };
  if (!isCreatorEligibleForMission(creator, mission)) return { allowed: false, reason: "Creator does not satisfy eligibility rules." };
  if (acceptedTermsVersion !== mission.termsVersion) return { allowed: false, reason: "Creator must accept current mission terms." };
  if (mission.accessMode === "restricted" && !mission.permittedCreatorIds.includes(creator.id)) {
    return { allowed: false, reason: "Creator is not permitted for this restricted mission." };
  }
  if (existingSubmissionUrls.has(reelUrl)) return { allowed: false, reason: "Duplicate Reel submission." };

  return { allowed: true };
}

export function createInvitationToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashInvitationToken(token) };
}

export function hashInvitationToken(token: string): string {
  const pepper = process.env.INVITATION_TOKEN_PEPPER;
  if (!pepper && !isDemoMode()) throw new Error("Invitation token configuration is missing.");
  return createHash("sha256").update(`${token}.${pepper ?? "demo-pepper-not-for-production"}`).digest("hex");
}

export function verifyInvitationToken(token: string, storedHash: string): boolean {
  const hash = hashInvitationToken(token);
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(storedHash, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function canUseInvitation(params: {
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  now: Date;
}): boolean {
  return !params.acceptedAt && !params.revokedAt && params.expiresAt > params.now;
}

export function nextNotificationAttemptDelay(attemptCount: number): number {
  const bounded = Math.min(Math.max(attemptCount, 0), 6);
  return 2 ** bounded * 60;
}

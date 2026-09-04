import { describe, expect, it } from "vitest";
import { calculatePayoutEligibleMinor, canCreatorViewMissionDetails, canSubmitToMission, canUseInvitation, createInvitationToken, nextNotificationAttemptDelay, normalizeInstagramProfileUrl, normalizeInstagramUsername, verifyInvitationToken } from "@/lib/domain";
import { demoCreators, demoMissions } from "@/lib/demo-data";

describe("creator and mission rules", () => {
  it("normalizes Instagram identifiers", () => {
    expect(normalizeInstagramUsername(" @Maya.Desk ")).toBe("maya.desk");
    expect(normalizeInstagramProfileUrl("https://www.instagram.com/Maya.Desk/?hl=en")).toBe("https://www.instagram.com/maya.desk/");
  });

  it("selects only the highest achieved payout tier", () => {
    expect(calculatePayoutEligibleMinor(24_999, demoMissions[0].payoutTiers)).toBe(7_500);
    expect(calculatePayoutEligibleMinor(25_000, demoMissions[0].payoutTiers)).toBe(27_500);
    expect(calculatePayoutEligibleMinor(4_999, demoMissions[0].payoutTiers)).toBe(0);
  });

  it("blocks pending and suspended creators", () => {
    for (const creator of demoCreators.filter(item => item.status !== "approved")) {
      const result = canSubmitToMission({ creator, mission: demoMissions[0], hasApprovedApplication: true, acceptedTermsVersion: demoMissions[0].termsVersion, existingSubmissionUrls: new Set(), reelUrl: "https://instagram.com/reel/new/", now: new Date("2026-09-04T00:00:00Z") });
      expect(result.allowed).toBe(false);
    }
  });

  it("enforces restricted mission visibility and permission", () => {
    const restricted = { ...demoMissions[1], status: "live" as const };
    expect(canCreatorViewMissionDetails(null, restricted)).toBe(false);
    expect(canCreatorViewMissionDetails(demoCreators[0], restricted)).toBe(true);
    const result = canSubmitToMission({ creator: { ...demoCreators[0], id: crypto.randomUUID(), categories: ["fashion"] }, mission: restricted, hasApprovedApplication: true, acceptedTermsVersion: restricted.termsVersion, existingSubmissionUrls: new Set(), reelUrl: "https://instagram.com/reel/new/", now: new Date("2026-09-04T00:00:00Z") });
    expect(result).toEqual({ allowed: false, reason: "Creator is not permitted for this restricted mission." });
  });

  it("requires an approved application and blocks duplicate Reels", () => {
    const creator = demoCreators[0]; const mission = demoMissions[0]; const url = "https://instagram.com/reel/new/";
    expect(canSubmitToMission({ creator, mission, hasApprovedApplication: false, acceptedTermsVersion: mission.termsVersion, existingSubmissionUrls: new Set(), reelUrl: url, now: new Date("2026-09-04T00:00:00Z") })).toEqual({ allowed: false, reason: "An approved mission application is required." });
    expect(canSubmitToMission({ creator, mission, hasApprovedApplication: true, acceptedTermsVersion: mission.termsVersion, existingSubmissionUrls: new Set([url]), reelUrl: url, now: new Date("2026-09-04T00:00:00Z") }).allowed).toBe(false);
    expect(canSubmitToMission({ creator, mission: { ...mission, reservedSlots: mission.capacity, committedBudgetMinor: mission.budgetMinor }, hasApprovedApplication: true, acceptedTermsVersion: mission.termsVersion, existingSubmissionUrls: new Set(), reelUrl: url, now: new Date("2026-09-04T00:00:00Z") }).allowed).toBe(true);
  });
});

describe("security primitives", () => {
  it("hashes and verifies invitation tokens without storing the raw token", () => {
    const invitation = createInvitationToken();
    expect(invitation.hash).not.toContain(invitation.token);
    expect(verifyInvitationToken(invitation.token, invitation.hash)).toBe(true);
    expect(verifyInvitationToken(`${invitation.token}x`, invitation.hash)).toBe(false);
  });

  it("rejects expired, used, and revoked invitations", () => {
    const future = new Date("2026-09-05T00:00:00Z"); const now = new Date("2026-09-04T00:00:00Z");
    expect(canUseInvitation({ expiresAt: future, acceptedAt: null, revokedAt: null, now })).toBe(true);
    expect(canUseInvitation({ expiresAt: now, acceptedAt: null, revokedAt: null, now })).toBe(false);
    expect(canUseInvitation({ expiresAt: future, acceptedAt: now, revokedAt: null, now })).toBe(false);
    expect(canUseInvitation({ expiresAt: future, acceptedAt: null, revokedAt: now, now })).toBe(false);
  });

  it("bounds exponential notification retry delay", () => {
    expect(nextNotificationAttemptDelay(0)).toBe(60);
    expect(nextNotificationAttemptDelay(3)).toBe(480);
    expect(nextNotificationAttemptDelay(99)).toBe(3840);
  });
});

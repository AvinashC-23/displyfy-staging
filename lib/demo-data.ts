import type { AuditEvent, CreatorProfile, Mission, Submission } from "./types";

export const demoCreators: CreatorProfile[] = [
  {
    id: "1f76c3b1-a6cc-4425-a8c8-d0fc2fb5b7a4",
    displayName: "Maya Desk Lab",
    instagramUsername: "mayadesklab",
    country: "US",
    categories: ["lifestyle", "tech", "home"],
    followerCount: 42000,
    averageReelViews: 18500,
    status: "approved"
  },
  {
    id: "9280cf6c-9799-4382-bdfa-5b4cb479ae2d",
    displayName: "Arjun Everyday Fit",
    instagramUsername: "arjuneverydayfit",
    country: "IN",
    categories: ["fitness", "lifestyle"],
    followerCount: 68000,
    averageReelViews: 31000,
    status: "pending_review"
  },
  {
    id: "d3065316-2b2e-4f1a-8332-2718f924f20d",
    displayName: "Former Studio",
    instagramUsername: "formerstudio",
    country: "GB",
    categories: ["fashion"],
    followerCount: 125000,
    averageReelViews: 52000,
    status: "suspended"
  }
];

export const demoMissions: Mission[] = [
  {
    id: "7fa93180-4c69-40f2-8984-7a3f28506b3a",
    brandName: "Northline Goods",
    brandVerified: true,
    name: "Desk object placement for launch week",
    objective: "Place a branded ceramic mug naturally inside workspace and routine reels.",
    category: "lifestyle",
    eligibleCountries: ["US", "CA", "GB"],
    accessMode: "open",
    visibility: "public_summary",
    participationApproval: "automatic_for_eligible_approved_creators",
    placementType: "Physical product in frame",
    placementInstructions: "Mug must be clearly visible on the desk for at least eight continuous seconds without verbal endorsement requirements.",
    requiredVisibilitySeconds: 8,
    creativeRestrictions: "No competitor drinkware in the same scene. No misleading health or performance claims.",
    requiredDisclosure: "#ad or Paid partnership disclosure in caption.",
    applicationDeadline: "2026-09-14",
    publicationDeadline: "2026-09-21",
    measurementDeadline: "2026-10-05",
    minimumQualifyingViews: 5000,
    payoutTiers: [
      { views: 5000, amountMinor: 7500 },
      { views: 25000, amountMinor: 27500 }
    ],
    maxPayoutMinor: 27500,
    currency: "USD",
    capacity: 40,
    reservedSlots: 12,
    budgetMinor: 1_100_000,
    committedBudgetMinor: 330_000,
    status: "live",
    permittedCreatorIds: [],
    termsVersion: "2026-09-04"
  },
  {
    id: "97f54005-fb9e-4ef2-a734-9643442cdb42",
    brandName: "Signal Thread",
    brandVerified: true,
    name: "Restricted apparel visibility test",
    objective: "Evaluate creator-native logo visibility for a limited capsule drop.",
    category: "fashion",
    eligibleCountries: ["US", "GB"],
    accessMode: "restricted",
    visibility: "invited_creators_only",
    participationApproval: "brand_and_admin_approval_required",
    placementType: "Creator wearing branded item",
    placementInstructions: "Logo must be unobstructed in three separate shots and visible for twelve total seconds.",
    requiredVisibilitySeconds: 12,
    creativeRestrictions: "No alcohol, firearms, political messaging, or competitor apparel in frame.",
    requiredDisclosure: "Paid partnership disclosure required.",
    applicationDeadline: "2026-09-20",
    publicationDeadline: "2026-09-28",
    measurementDeadline: "2026-10-12",
    minimumQualifyingViews: 10000,
    payoutTiers: [
      { views: 10000, amountMinor: 15000 },
      { views: 50000, amountMinor: 65000 }
    ],
    maxPayoutMinor: 65000,
    currency: "USD",
    capacity: 10,
    reservedSlots: 4,
    budgetMinor: 650_000,
    committedBudgetMinor: 260_000,
    status: "approved",
    permittedCreatorIds: ["1f76c3b1-a6cc-4425-a8c8-d0fc2fb5b7a4"],
    termsVersion: "2026-09-04"
  },
  {
    id: "a76c0dc8-0b47-4736-91cb-3e9cdf336772",
    brandName: "Bright Pantry",
    brandVerified: false,
    name: "Background product shelf trial",
    objective: "Draft mission awaiting brand completion.",
    category: "food",
    eligibleCountries: ["US"],
    accessMode: "open",
    visibility: "registered_creators",
    participationApproval: "admin_approval_required",
    placementType: "Product in background",
    placementInstructions: "Product should be visible in kitchen shelf b-roll.",
    requiredVisibilitySeconds: 6,
    creativeRestrictions: "No claims about nutrition or outcomes.",
    requiredDisclosure: "#ad",
    applicationDeadline: "2026-09-17",
    publicationDeadline: "2026-09-24",
    measurementDeadline: "2026-10-08",
    minimumQualifyingViews: 3000,
    payoutTiers: [
      { views: 3000, amountMinor: 5000 },
      { views: 15000, amountMinor: 20000 }
    ],
    maxPayoutMinor: 20000,
    currency: "USD",
    capacity: 25,
    reservedSlots: 0,
    budgetMinor: 500_000,
    committedBudgetMinor: 0,
    status: "draft",
    permittedCreatorIds: [],
    termsVersion: "2026-09-04"
  }
];

export const demoSubmissions: Submission[] = [
  {
    id: "087aa7f8-7465-41cb-bec7-60b106eb1680",
    creatorId: "1f76c3b1-a6cc-4425-a8c8-d0fc2fb5b7a4",
    missionId: "7fa93180-4c69-40f2-8984-7a3f28506b3a",
    reelUrl: "https://www.instagram.com/reel/demoapproved/",
    caption: "Morning setup with the new mug. #ad",
    publicationDate: "2026-09-03",
    status: "approved",
    views: 12800,
    metricSource: "manual_admin_review",
    payoutEligibleMinor: 7500
  },
  {
    id: "7da2dd49-c06d-4dd8-b1c3-c847e4e08c13",
    creatorId: "1f76c3b1-a6cc-4425-a8c8-d0fc2fb5b7a4",
    missionId: "7fa93180-4c69-40f2-8984-7a3f28506b3a",
    reelUrl: "https://www.instagram.com/reel/demopayout/",
    caption: "Desk refresh with disclosure. #ad",
    publicationDate: "2026-09-02",
    status: "payout_eligible",
    views: 28300,
    metricSource: "manual_admin_review",
    payoutEligibleMinor: 27500
  }
];

export const demoAuditEvents: AuditEvent[] = [
  {
    id: "2937effd-9735-46f3-9340-9fdf78f59cfb",
    actorRole: "admin",
    action: "creator.approved",
    entityType: "creator_profile",
    entityId: "1f76c3b1-a6cc-4425-a8c8-d0fc2fb5b7a4",
    createdAt: "2026-09-04T08:30:00.000Z"
  },
  {
    id: "db9293dd-914c-4810-acd1-f5f1bf032afe",
    actorRole: "admin",
    action: "submission.payout_eligible",
    entityType: "creator_submission",
    entityId: "7da2dd49-c06d-4dd8-b1c3-c847e4e08c13",
    createdAt: "2026-09-04T09:12:00.000Z"
  }
];

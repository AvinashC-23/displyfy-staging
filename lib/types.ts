export type CreatorStatus =
  | "draft"
  | "pending_review"
  | "more_information_required"
  | "approved"
  | "rejected"
  | "suspended";

export type BrandAccessStatus =
  | "pending_review"
  | "more_information_required"
  | "approved"
  | "rejected"
  | "invited"
  | "activated"
  | "suspended";

export type MissionAccessMode = "open" | "restricted";

export type MissionParticipationApproval =
  | "automatic_for_eligible_approved_creators"
  | "admin_approval_required"
  | "brand_and_admin_approval_required";

export type MissionVisibility =
  | "public_summary"
  | "registered_creators"
  | "invited_creators_only";

export type MissionStatus =
  | "draft"
  | "submitted_for_review"
  | "changes_requested"
  | "approved"
  | "live"
  | "paused"
  | "completed"
  | "cancelled";

export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "monitoring_performance"
  | "payout_eligible"
  | "paid";

export type MetricSource =
  | "meta_api"
  | "manual_admin_review"
  | "creator_supplied"
  | "brand_supplied";

export type NotificationStatus =
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled";

export type Money = {
  amountMinor: number;
  currency: string;
};

export type CreatorProfile = {
  id: string;
  displayName: string;
  instagramUsername: string;
  country: string;
  categories: string[];
  followerCount: number;
  averageReelViews: number;
  status: CreatorStatus;
};

export type Mission = {
  id: string;
  brandName: string;
  brandVerified: boolean;
  name: string;
  objective: string;
  category: string;
  eligibleCountries: string[];
  accessMode: MissionAccessMode;
  visibility: MissionVisibility;
  participationApproval: MissionParticipationApproval;
  placementType: string;
  placementInstructions: string;
  requiredVisibilitySeconds: number;
  creativeRestrictions: string;
  requiredDisclosure: string;
  applicationDeadline: string;
  publicationDeadline: string;
  measurementDeadline: string;
  minimumQualifyingViews: number;
  payoutTiers: PayoutTier[];
  maxPayoutMinor: number;
  currency: string;
  capacity: number;
  reservedSlots: number;
  budgetMinor: number;
  committedBudgetMinor: number;
  status: MissionStatus;
  permittedCreatorIds: string[];
  termsVersion: string;
};

export type PayoutTier = {
  views: number;
  amountMinor: number;
};

export type Submission = {
  id: string;
  creatorId: string;
  missionId: string;
  reelUrl: string;
  caption: string;
  publicationDate: string;
  status: SubmissionStatus;
  views: number;
  metricSource: MetricSource;
  payoutEligibleMinor: number;
};

export type AuditEvent = {
  id: string;
  actorRole: "system" | "admin" | "brand" | "creator";
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

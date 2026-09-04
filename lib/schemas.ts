import { z } from "zod";

export const countries = ["US", "IN", "GB", "CA", "AU", "AE", "SG"] as const;
export const contentCategories = [
  "lifestyle",
  "fashion",
  "beauty",
  "fitness",
  "food",
  "tech",
  "home",
  "travel",
  "business"
] as const;

export const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Use an ISO 4217 currency code.");

export const moneyMinorSchema = z
  .number()
  .int()
  .min(0)
  .max(50_000_000, "Budget is outside the MVP limit.");

export const instagramUsernameSchema = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .regex(/^@?[A-Za-z0-9._]+$/, "Use a valid Instagram username.");

export const instagramProfileUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const parsed = new URL(value);
    return ["instagram.com", "www.instagram.com"].includes(parsed.hostname);
  }, "Use an instagram.com profile URL.");

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .max(128);

export const creatorApplicationSchema = z
  .object({
    legalName: z.string().trim().min(2).max(120),
    displayName: z.string().trim().min(2).max(80),
    instagramUsername: instagramUsernameSchema,
    instagramProfileUrl: instagramProfileUrlSchema,
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().regex(/^\+[1-9]\d{7,14}$/, "Use E.164 format, for example +14155552671."),
    country: z.enum(countries),
    primaryCategory: z.enum(contentCategories),
    secondaryCategories: z.array(z.enum(contentCategories)).max(4).default([]),
    preferredLanguage: z.string().trim().min(2).max(40),
    followerRange: z.enum(["1k-10k", "10k-50k", "50k-250k", "250k-1m", "1m+"]),
    averageReelViews: z.coerce.number().int().min(0).max(500_000_000),
    contentDescription: z.string().trim().min(20).max(700),
    password: passwordSchema,
    passwordConfirmation: z.string(),
    acceptTerms: z.literal(true),
    acceptPrivacy: z.literal(true),
    acceptDisclosure: z.literal(true),
    consentNotifications: z.literal(true)
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords must match.",
    path: ["passwordConfirmation"]
  });

export const brandAccessSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  jobTitle: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  companyWebsite: z.string().trim().url(),
  workEmail: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().regex(/^\+[1-9]\d{7,14}$/),
  country: z.enum(countries),
  estimatedBudget: z.enum(["under-5k", "5k-25k", "25k-100k", "100k-plus"]),
  campaignObjective: z.string().trim().min(12).max(500),
  message: z.string().trim().max(1200).optional().default("")
});

export const missionSchema = z
  .object({
    name: z.string().trim().min(4).max(160),
    brandName: z.string().trim().min(2).max(160),
    objective: z.string().trim().min(20).max(900),
    accessMode: z.enum(["open", "restricted"]),
    visibility: z.enum(["public_summary", "registered_creators", "invited_creators_only"]),
    participationApproval: z.enum([
      "automatic_for_eligible_approved_creators",
      "admin_approval_required",
      "brand_and_admin_approval_required"
    ]),
    categories: z.array(z.enum(contentCategories)).min(1),
    eligibleCountries: z.array(z.enum(countries)).min(1),
    placementType: z.string().trim().min(2).max(80),
    placementInstructions: z.string().trim().min(20).max(1200),
    requiredVisibilitySeconds: z.coerce.number().int().min(1).max(180),
    requiredDisclosure: z.string().trim().min(4).max(220),
    prohibitedContent: z.string().trim().max(800),
    applicationDeadline: z.string().date(),
    publicationDeadline: z.string().date(),
    measurementDeadline: z.string().date(),
    minimumQualifyingViews: z.coerce.number().int().min(100).max(500_000_000),
    tierOneViews: z.coerce.number().int().min(100),
    tierOnePayoutMinor: moneyMinorSchema,
    tierTwoViews: z.coerce.number().int().min(100),
    tierTwoPayoutMinor: moneyMinorSchema,
    maxCreators: z.coerce.number().int().min(1).max(10_000),
    totalBudgetMinor: moneyMinorSchema,
    currency: currencySchema,
    reviewCriteria: z.string().trim().min(20).max(1200),
    terms: z.string().trim().min(20).max(2000)
  })
  .superRefine((data, ctx) => {
    if (data.publicationDeadline < data.applicationDeadline) {
      ctx.addIssue({
        code: "custom",
        path: ["publicationDeadline"],
        message: "Publication deadline must be after the application deadline."
      });
    }

    if (data.measurementDeadline < data.publicationDeadline) {
      ctx.addIssue({
        code: "custom",
        path: ["measurementDeadline"],
        message: "Measurement deadline must be after the publication deadline."
      });
    }

    if (data.tierTwoViews <= data.tierOneViews) {
      ctx.addIssue({
        code: "custom",
        path: ["tierTwoViews"],
        message: "Second tier must require more views than the first tier."
      });
    }

    if (data.totalBudgetMinor < data.tierTwoPayoutMinor * data.maxCreators) {
      ctx.addIssue({
        code: "custom",
        path: ["totalBudgetMinor"],
        message: "Budget must cover the maximum committed payout."
      });
    }
  });

export const reelSubmissionSchema = z.object({
  missionId: z.string().uuid(),
  reelUrl: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const parsed = new URL(value);
      return ["instagram.com", "www.instagram.com"].includes(parsed.hostname) && parsed.pathname.includes("/reel/");
    }, "Use a public Instagram Reel URL."),
  publicationDate: z.string().date(),
  caption: z.string().trim().min(1).max(2200),
  disclosureConfirmed: z.literal(true),
  missionTermsAccepted: z.literal(true),
  acceptedTermsVersion: z.string().trim().min(1).max(80),
  notes: z.string().trim().max(1000).optional().default("")
});

export const missionApplicationSchema = z.object({
  missionId: z.string().uuid(),
  acceptedTermsVersion: z.string().trim().min(1).max(80),
  acceptCurrentTerms: z.literal(true)
});

export const submissionReviewSchema = z.object({
  submissionId: z.string().uuid(),
  placementVerified: z.coerce.boolean(),
  disclosureVerified: z.coerce.boolean(),
  placementDurationSeconds: z.coerce.number().int().min(0).max(3600),
  views: z.coerce.number().int().min(0).max(2_000_000_000),
  reach: z.coerce.number().int().min(0).max(2_000_000_000),
  engagement: z.coerce.number().int().min(0).max(2_000_000_000),
  metricSource: z.enum(["manual_admin_review", "creator_supplied", "brand_supplied"]),
  creatorVisibleNotes: z.string().trim().max(1000).optional().default(""),
  internalNotes: z.string().trim().max(2000).optional().default("")
});

export const adminActionSchema = z.object({
  entityType: z.enum(["creator", "mission", "submission"]),
  entityId: z.string().uuid(),
  action: z.enum(["approve", "reject", "request_information", "suspend", "restore", "publish", "pause", "mark_payout_eligible", "mark_paid"]),
  reason: z.string().trim().max(1000).optional().default(""),
  views: z.coerce.number().int().min(0).max(2_000_000_000).optional(),
  externalReference: z.string().trim().max(200).optional()
});

export type CreatorApplicationInput = z.infer<typeof creatorApplicationSchema>;
export type BrandAccessInput = z.infer<typeof brandAccessSchema>;
export type MissionInput = z.infer<typeof missionSchema>;
export type ReelSubmissionInput = z.infer<typeof reelSubmissionSchema>;
export type MissionApplicationInput = z.infer<typeof missionApplicationSchema>;
export type SubmissionReviewInput = z.infer<typeof submissionReviewSchema>;
export type AdminActionInput = z.infer<typeof adminActionSchema>;

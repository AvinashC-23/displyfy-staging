import { describe, expect, it } from "vitest";
import { brandAccessSchema, creatorApplicationSchema, creatorProfileUpdateSchema, currencySchema, missionApplicationSchema, missionSchema, moneyMinorSchema, reelSubmissionSchema } from "@/lib/schemas";

const creator = { legalName:"Maya Rao",displayName:"Maya Desk",instagramUsername:"@mayadesk",instagramProfileUrl:"https://instagram.com/mayadesk",email:"MAYA@example.com",phone:"+919876543210",country:"IN",primaryCategory:"lifestyle",secondaryCategories:["tech"],preferredLanguage:"English",followerRange:"10k-50k",averageReelViews:18000,contentDescription:"Workspace and everyday technology content for curious professionals.",password:"correct horse battery staple",passwordConfirmation:"correct horse battery staple",acceptTerms:true,acceptPrivacy:true,acceptDisclosure:true,consentNotifications:true };

describe("external input validation", () => {
  it("accepts a complete creator application and normalizes email", () => {
    const result=creatorApplicationSchema.parse(creator); expect(result.email).toBe("maya@example.com");
  });
  it("rejects Instagram impostor hosts and password mismatch", () => {
    expect(creatorApplicationSchema.safeParse({...creator,instagramProfileUrl:"https://instagram.com.attacker.test/user"}).success).toBe(false);
    expect(creatorApplicationSchema.safeParse({...creator,passwordConfirmation:"different-password"}).success).toBe(false);
  });
  it("treats hostile HTML and SQL strings as bounded text data", () => {
    const result=brandAccessSchema.parse({contactName:"Robert'); DROP TABLE--",jobTitle:"Marketing lead",companyName:"Example Co",companyWebsite:"https://example.com",workEmail:"robert@example.com",phone:"+14155552671",country:"US",estimatedBudget:"5k-25k",campaignObjective:"<script>alert('xss')</script> launch awareness",message:"' OR 1=1 --"});
    expect(result.campaignObjective).toContain("<script>"); expect(result.message).toBe("' OR 1=1 --");
  });
  it("rejects invalid currency and budget extremes", () => {
    expect(currencySchema.safeParse("US1").success).toBe(false); expect(moneyMinorSchema.safeParse(-1).success).toBe(false); expect(moneyMinorSchema.safeParse(99_999_999).success).toBe(false);
  });
  it("rejects non-Reel Instagram URLs", () => {
    expect(reelSubmissionSchema.safeParse({missionId:crypto.randomUUID(),reelUrl:"https://instagram.com/p/post",publicationDate:"2026-09-04",caption:"#ad",disclosureConfirmed:true,missionTermsAccepted:true,acceptedTermsVersion:"2026-09-04",notes:""}).success).toBe(false);
  });
  it("requires a valid mission and explicit current-terms acceptance", () => {
    expect(missionApplicationSchema.safeParse({missionId:crypto.randomUUID(),acceptedTermsVersion:"2026-09-04",acceptCurrentTerms:true}).success).toBe(true);
    expect(missionApplicationSchema.safeParse({missionId:"not-a-mission",acceptedTermsVersion:"2026-09-04",acceptCurrentTerms:false}).success).toBe(false);
  });
  it("accepts bounded creator profile edits and rejects unsupported categories", () => {
    const profile = { legalName:"Maya Rao",displayName:"Maya Desk",instagramUsername:"@mayadesk",instagramProfileUrl:"https://instagram.com/mayadesk",phone:"+919876543210",country:"IN",categories:["lifestyle","tech"],preferredLanguage:"English",followerCount:42000,averageReelViews:18000 };
    expect(creatorProfileUpdateSchema.safeParse(profile).success).toBe(true);
    expect(creatorProfileUpdateSchema.safeParse({...profile,categories:["crypto"]}).success).toBe(false);
  });
  it("validates date order and maximum budget commitment", () => {
    const input={name:"Launch mission",brandName:"Example",objective:"A complete measurable awareness objective for creators.",accessMode:"open",visibility:"public_summary",participationApproval:"automatic_for_eligible_approved_creators",categories:["lifestyle"],eligibleCountries:["US"],placementType:"Product",placementInstructions:"Product must remain visible in the primary scene.",requiredVisibilitySeconds:8,requiredDisclosure:"#ad",prohibitedContent:"none",applicationDeadline:"2026-09-20",publicationDeadline:"2026-09-10",measurementDeadline:"2026-09-30",minimumQualifyingViews:1000,tierOneViews:1000,tierOnePayoutMinor:5000,tierTwoViews:10000,tierTwoPayoutMinor:20000,maxCreators:10,totalBudgetMinor:10000,currency:"USD",reviewCriteria:"Verify placement and disclosure requirements.",terms:"Keep the content public through measurement."};
    expect(missionSchema.safeParse(input).success).toBe(false);
  });
});

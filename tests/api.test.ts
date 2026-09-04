import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST as submitBrandAccess } from "@/app/api/brand-access/route";
import { POST as submitReel } from "@/app/api/submissions/route";
import { demoMissions } from "@/lib/demo-data";

function request(path: string, body: unknown, origin = "http://localhost:3000") { return new NextRequest(`http://localhost:3000${path}`, { method:"POST", headers:{"content-type":"application/json",origin}, body:JSON.stringify(body) }); }

describe("route authorization and workflow", () => {
  it("rejects cross-origin mutation requests", async () => {
    const response=await submitBrandAccess(request("/api/brand-access",{},"https://attacker.test")); expect(response.status).toBe(403);
  });
  it("accepts valid brand access only as a non-persisted demo operation", async () => {
    const response=await submitBrandAccess(request("/api/brand-access",{contactName:"Taylor Morgan",jobTitle:"Marketing Lead",companyName:"Northline",companyWebsite:"https://example.com",workEmail:"taylor@example.com",phone:"+14155552671",country:"US",estimatedBudget:"5k-25k",campaignObjective:"Build awareness through creator-native placements.",message:""}));
    expect(response.status).toBe(202); expect(await response.json()).toMatchObject({mode:"demo",persisted:false,externallyDelivered:false,requestStatus:"pending_review"});
  });
  it("prevents duplicate Reel submission", async () => {
    const response=await submitReel(request("/api/submissions",{missionId:demoMissions[0].id,reelUrl:"https://www.instagram.com/reel/demoapproved/",publicationDate:"2026-09-03",caption:"Morning setup #ad",disclosureConfirmed:true,missionTermsAccepted:true,acceptedTermsVersion:demoMissions[0].termsVersion,notes:""}));
    expect(response.status).toBe(403); expect((await response.json()).error).toMatch(/Duplicate/);
  });
  it("rejects request bodies larger than the API limit", async () => {
    const response = await submitBrandAccess(new NextRequest("http://localhost:3000/api/brand-access", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost:3000", "content-length": "70000" },
      body: JSON.stringify({ message: "x" })
    }));
    expect(response.status).toBe(413);
  });
});

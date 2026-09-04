"use client";

import { useState } from "react";
import { postJson } from "@/lib/client-http";

export function MissionForm() {
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    const data = Object.fromEntries(formData);
    const payload = { ...data, categories: [data.categories], eligibleCountries: [data.eligibleCountries], requiredVisibilitySeconds: Number(data.requiredVisibilitySeconds), minimumQualifyingViews: Number(data.minimumQualifyingViews), tierOneViews: Number(data.tierOneViews), tierOnePayoutMinor: Number(data.tierOnePayoutMinor), tierTwoViews: Number(data.tierTwoViews), tierTwoPayoutMinor: Number(data.tierTwoPayoutMinor), maxCreators: Number(data.maxCreators), totalBudgetMinor: Number(data.totalBudgetMinor) };
    const result = await postJson("/api/missions", payload);
    setMessage(result.message ?? result.error ?? "Unable to save mission.");
  }
  return <form className="form-panel form-grid" action={submit}>
    <Input name="name" label="Mission name" defaultValue="Workspace product visibility launch" />
    <Input name="brandName" label="Brand" defaultValue="Northline Goods" />
    <Text name="objective" label="Campaign objective" defaultValue="Build measurable awareness through natural product visibility inside creator workspace Reels." />
    <Select name="accessMode" label="Access mode" options={["open","restricted"]} />
    <Select name="visibility" label="Visibility" options={["public_summary","registered_creators","invited_creators_only"]} />
    <Select name="participationApproval" label="Approval policy" options={["automatic_for_eligible_approved_creators","admin_approval_required","brand_and_admin_approval_required"]} />
    <Select name="categories" label="Creator category" options={["lifestyle","tech","home","fashion","fitness"]} />
    <Select name="eligibleCountries" label="Eligible country" options={["US","IN","GB","CA","AU"]} />
    <Input name="placementType" label="Placement type" defaultValue="Physical product in frame" />
    <Input name="requiredVisibilitySeconds" label="Visibility seconds" type="number" defaultValue="8" />
    <Text name="placementInstructions" label="Placement instructions" defaultValue="Keep the product clearly visible in the primary scene for at least eight continuous seconds." />
    <Input name="requiredDisclosure" label="Required disclosure" defaultValue="#ad or Paid partnership disclosure" />
    <Text name="prohibitedContent" label="Prohibited content" defaultValue="No competitor products, unsafe activity, or unsupported performance claims." />
    <Input name="applicationDeadline" label="Application deadline" type="date" defaultValue="2026-09-14" />
    <Input name="publicationDeadline" label="Publication deadline" type="date" defaultValue="2026-09-21" />
    <Input name="measurementDeadline" label="Measurement deadline" type="date" defaultValue="2026-10-05" />
    <Input name="minimumQualifyingViews" label="Minimum views" type="number" defaultValue="5000" />
    <Input name="tierOneViews" label="Tier one views" type="number" defaultValue="5000" />
    <Input name="tierOnePayoutMinor" label="Tier one payout (minor units)" type="number" defaultValue="7500" />
    <Input name="tierTwoViews" label="Tier two views" type="number" defaultValue="25000" />
    <Input name="tierTwoPayoutMinor" label="Tier two payout (minor units)" type="number" defaultValue="27500" />
    <Input name="maxCreators" label="Maximum creators" type="number" defaultValue="20" />
    <Input name="totalBudgetMinor" label="Total budget (minor units)" type="number" defaultValue="550000" />
    <Input name="currency" label="Currency" defaultValue="USD" />
    <Text name="reviewCriteria" label="Submission review criteria" defaultValue="Product visible for required duration, disclosure present, public Reel URL active, and no prohibited content." />
    <Text name="terms" label="Mission terms" defaultValue="Creator agrees to keep the Reel public through the measurement deadline and comply with disclosure rules." />
    {message && <div className="form-status field full" role="status">{message}</div>}
    <div className="field full"><button className="button">Submit mission for admin review</button></div>
  </form>;
}

function Input({ name, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string }) { return <div className="field"><label htmlFor={name}>{label}</label><input className="input" id={name} name={name} required {...props} /></div>; }
function Text({ name, label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string; label: string }) { return <div className="field full"><label htmlFor={name}>{label}</label><textarea className="input" id={name} name={name} required {...props} /></div>; }
function Select({ name, label, options }: { name: string; label: string; options: string[] }) { return <div className="field"><label htmlFor={name}>{label}</label><select className="input" id={name} name={name}>{options.map(v => <option key={v}>{v}</option>)}</select></div>; }

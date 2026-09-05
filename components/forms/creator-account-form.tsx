"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { contentCategories, countries, type CreatorProfileUpdateInput } from "@/lib/schemas";
import { patchJson } from "@/lib/client-http";

type CreatorAccountFormProps = CreatorProfileUpdateInput & { email: string };

export function CreatorAccountForm(props: CreatorAccountFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(props.categories);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : current.length < 5 ? [...current, category] : current);
  };

  async function submit(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await patchJson("/api/creator-profile", {
      ...Object.fromEntries(formData),
      categories: selectedCategories,
      followerCount: Number(formData.get("followerCount")),
      averageReelViews: Number(formData.get("averageReelViews"))
    });
    setSaving(false);
    setMessage(String(result.message ?? result.error ?? "Your profile could not be updated."));
    if (result.message) router.refresh();
  }

  return <form className="creator-account-form form-grid" action={submit}>
    <div className="field"><label htmlFor="displayName">Display name</label><input className="input" id="displayName" name="displayName" defaultValue={props.displayName} required /></div>
    <div className="field"><label htmlFor="legalName">Legal name</label><input className="input" id="legalName" name="legalName" defaultValue={props.legalName} required /></div>
    <div className="field full"><label htmlFor="email">Account email</label><input className="input account-readonly" id="email" value={props.email} readOnly aria-readonly="true" /></div>
    <div className="field"><label htmlFor="phone">Phone</label><input className="input" id="phone" name="phone" type="tel" defaultValue={props.phone} required /></div>
    <div className="field"><label htmlFor="country">Country</label><select className="input" id="country" name="country" defaultValue={props.country}>{countries.map((country) => <option value={country} key={country}>{country}</option>)}</select></div>
    <div className="field"><label htmlFor="instagramUsername">Instagram username</label><input className="input" id="instagramUsername" name="instagramUsername" defaultValue={props.instagramUsername} required /></div>
    <div className="field"><label htmlFor="instagramProfileUrl">Instagram profile URL</label><input className="input" id="instagramProfileUrl" name="instagramProfileUrl" type="url" defaultValue={props.instagramProfileUrl} required /></div>
    <div className="field"><label htmlFor="followerCount">Followers</label><input className="input" id="followerCount" name="followerCount" type="number" min="0" defaultValue={props.followerCount} required /></div>
    <div className="field"><label htmlFor="averageReelViews">Average Reel views</label><input className="input" id="averageReelViews" name="averageReelViews" type="number" min="0" defaultValue={props.averageReelViews} required /></div>
    <div className="field full"><label htmlFor="preferredLanguage">Preferred language</label><input className="input" id="preferredLanguage" name="preferredLanguage" defaultValue={props.preferredLanguage} required /></div>
    <fieldset className="account-categories field full"><legend>Content categories</legend>{contentCategories.map((category) => <label className={selectedCategories.includes(category) ? "selected" : ""} key={category}><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} /><span>{category}</span></label>)}</fieldset>
    {message && <div className="form-status field full" role="status">{message}</div>}
    <button className="button acid account-save field full" disabled={saving || selectedCategories.length === 0}><Save size={18} aria-hidden />{saving ? "Saving..." : "Save account details"}</button>
  </form>;
}

"use client";

import { useState } from "react";
import type { Mission } from "@/lib/types";
import { postJson } from "@/lib/client-http";

export function ReelSubmissionForm({ missions }: { missions: Mission[] }) {
  const [message, setMessage] = useState("");
  const liveMissions = missions.filter(m => m.status === "live");
  const [missionId, setMissionId] = useState(liveMissions[0]?.id ?? "");
  const termsVersion = liveMissions.find(m => m.id === missionId)?.termsVersion ?? "";
  async function submit(formData: FormData) {
    const result = await postJson("/api/submissions", { ...Object.fromEntries(formData), disclosureConfirmed: true, missionTermsAccepted: true, acceptedTermsVersion: termsVersion });
    setMessage(result.message ?? result.error ?? "Unable to submit Reel.");
  }
  return <form className="form-grid" action={submit}>
    <div className="field full"><label htmlFor="missionId">Mission</label><select className="input" id="missionId" name="missionId" value={missionId} onChange={event => setMissionId(event.target.value)}>{liveMissions.map(m => <option value={m.id} key={m.id}>{m.name}</option>)}</select></div>
    <div className="field full"><label htmlFor="reelUrl">Instagram Reel URL</label><input className="input" id="reelUrl" name="reelUrl" type="url" placeholder="https://instagram.com/reel/..." required /></div>
    <div className="field"><label htmlFor="publicationDate">Publication date</label><input className="input" id="publicationDate" name="publicationDate" type="date" required /></div>
    <div className="field full"><label htmlFor="caption">Caption</label><textarea className="input" id="caption" name="caption" required /></div>
    <div className="field full"><label htmlFor="notes">Optional notes</label><textarea className="input" id="notes" name="notes" /></div>
    <label className="check field full"><input type="checkbox" required /> I confirm the Reel includes the required disclosure.</label>
    <label className="check field full"><input type="checkbox" required /> I accept the current mission terms ({termsVersion}).</label>
    {message && <div className="form-status field full" role="status">{message}</div>}
    <button className="button field full">Submit Reel for review</button>
  </form>;
}

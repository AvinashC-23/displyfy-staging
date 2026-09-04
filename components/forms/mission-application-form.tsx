"use client";

import { useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { postJson } from "@/lib/client-http";

export function MissionApplicationForm({ missionId, termsVersion, enabled, unavailableReason }: { missionId: string; termsVersion: string; enabled: boolean; unavailableReason?: string }) {
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function apply() {
    if (!accepted || !enabled) return;
    setBusy(true);
    setStatus("");
    const data = await postJson("/api/mission-applications", { missionId, acceptedTermsVersion: termsVersion, acceptCurrentTerms: accepted });
    setStatus(String(data.message ?? data.error ?? "Application could not be completed."));
    setBusy(false);
  }

  return <div className="apply-panel">
    <div className="apply-panel-heading"><CircleCheck size={24} aria-hidden /><div><span>Ready to create?</span><p>Applying reserves a creator spot when the mission allows automatic participation.</p></div></div>
    <label className="check"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} disabled={!enabled} /> I have reviewed and accept the current mission terms and disclosure requirements.</label>
    <button className="button acid" type="button" onClick={apply} disabled={!enabled || !accepted || busy}>{busy ? "Applying..." : "Apply for this mission"}<ArrowRight size={18} aria-hidden /></button>
    {!enabled && <p className="application-note">{unavailableReason ?? "Applications are not open for this mission."}</p>}
    {status && <p className="form-status" role="status">{status}</p>}
  </div>;
}

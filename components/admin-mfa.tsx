"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type FactorState = {
  id: string;
  qrCode?: string;
  secret?: string;
};

function qrSource(value: string) {
  return value.startsWith("data:") ? value : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(value)}`;
}

export function AdminMfa() {
  const started = useRef(false);
  const [factor, setFactor] = useState<FactorState | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Preparing secure verification...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      const client = createBrowserSupabase();
      if (!client) { setMessage("Authentication is not configured."); return; }
      const assurance = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assurance.data?.currentLevel === "aal2") { window.location.replace("/admin"); return; }

      const listed = await client.auth.mfa.listFactors();
      if (listed.error) { setMessage("Verification factors could not be loaded."); return; }
      const verified = listed.data.totp.find((item) => item.status === "verified");
      if (verified) {
        setFactor({ id: verified.id });
        setMessage("Enter the six-digit code from your authenticator app.");
        return;
      }

      await Promise.all(listed.data.totp.filter((item) => item.status !== "verified").map((item) => client.auth.mfa.unenroll({ factorId: item.id })));
      const enrolled = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: "Displyfy admin" });
      if (enrolled.error) { setMessage("An authenticator could not be enrolled. Sign out and try again."); return; }
      setFactor({ id: enrolled.data.id, qrCode: enrolled.data.totp.qr_code, secret: enrolled.data.totp.secret });
      setMessage("Scan the QR code, then enter the six-digit code from your authenticator app.");
    })();
  }, []);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factor || !/^\d{6}$/.test(code)) { setMessage("Enter a valid six-digit verification code."); return; }
    setBusy(true);
    const client = createBrowserSupabase();
    if (!client) { setMessage("Authentication is not configured."); setBusy(false); return; }
    const result = await client.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (result.error) { setMessage("That code could not be verified. Wait for a new code and try again."); setBusy(false); return; }
    await client.auth.refreshSession();
    window.location.replace("/admin");
  }

  return <section className="mfa-page">
    <div className="mfa-panel">
      <div className="mfa-icon"><ShieldCheck size={27} aria-hidden /></div>
      <p className="kicker">Administrator verification</p>
      <h1>Protect every reviewed decision.</h1>
      <p>Displyfy requires an authenticator code before opening operations, payout, or moderation tools.</p>
      {factor?.qrCode && <div className="mfa-enrollment">
        <Image src={qrSource(factor.qrCode)} alt="Authenticator enrollment QR code" width={220} height={220} unoptimized />
        <div><span>Cannot scan?</span><code>{factor.secret}</code><small>Store this secret only in your authenticator app. Do not share it.</small></div>
      </div>}
      <form className="mfa-form" onSubmit={verify}>
        <label htmlFor="mfa-code">Six-digit authenticator code</label>
        <div><KeyRound size={19} aria-hidden /><input id="mfa-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required disabled={!factor || busy} /></div>
        <button className="button acid" type="submit" disabled={!factor || busy}>{busy ? "Verifying..." : "Verify and continue"}</button>
      </form>
      <p className="mfa-status" role="status">{message}</p>
      <form action="/auth/signout" method="post"><button className="text-button" type="submit">Sign out</button></form>
    </div>
  </section>;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function AuthForm({ role, dashboard }: { role: "Creator" | "Brand" | "Admin"; dashboard: string }) {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    try {
      const client = createBrowserSupabase();
      if (!client) { setMessage("Authentication is not configured. Use the seeded demo dashboard."); return; }
      const email = String(formData.get("email") ?? "").trim().toLowerCase();
      if (role === "Brand") {
        const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(dashboard)}`, shouldCreateUser: false } });
        if (error) { setMessage("Unable to start sign in. Please try again."); return; }
        setMessage("If this approved account exists, a secure sign-in link has been sent.");
        return;
      }
      const password = String(formData.get("password") ?? "");
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) { setMessage("Unable to sign in with those details."); return; }
      window.location.assign(dashboard);
    } catch {
      setMessage("We could not reach the sign-in service. Check your connection and try again.");
    }
  }
  return <form className="form-panel form-grid" action={submit}>
    <div className="field full"><label htmlFor={`${role}-email`}>Email</label><input id={`${role}-email`} name="email" className="input" type="email" autoComplete="email" required disabled={!configured} placeholder={configured ? "you@example.com" : "Configure Supabase to enable"} /></div>
    {role !== "Brand" && <div className="field full"><label htmlFor={`${role}-password`}>Password</label><input id={`${role}-password`} name="password" className="input" type="password" autoComplete="current-password" minLength={12} required disabled={!configured} /></div>}
    {message && <div className="form-status field full" role="status">{message}</div>}
    {configured ? <button className="button field full">{role === "Brand" ? "Send secure sign-in link" : "Sign in"}</button> : <Link className="button field full" href={dashboard}>Open seeded {role.toLowerCase()} dashboard</Link>}
  </form>;
}

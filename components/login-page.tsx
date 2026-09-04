import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CircleCheck, LockKeyhole } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export function LoginPage({ role, dashboard }: { role: "Creator" | "Brand" | "Admin"; dashboard: string }) {
  const creator = role === "Creator";
  const admin = role === "Admin";
  return <section className="login-experience"><div className="login-art"><Image src={creator ? "/assets/illustrations/paid-partnership.webp" : "/assets/illustrations/brand-content-review.webp"} alt="" fill priority sizes="(max-width: 900px) 100vw, 52vw" /><div><span>{creator ? "Creator workspace" : admin ? "Protected operations" : "Brand workspace"}</span><strong>{creator ? "Missions, active work, and earnings in plain language." : admin ? "Reviewed decisions, traceable changes, and MFA-protected access." : "Mission briefs, creator work, and campaign commitment without spreadsheet fatigue."}</strong></div></div><div className="login-content"><Link className="back-link" href="/"><ArrowLeft size={17} /> Back to Displyfy</Link><p className="kicker">{role} sign in</p><h1>Welcome back.</h1><p>Sign in to continue with the work that matters now.</p><AuthForm role={role} dashboard={dashboard} /><div className="login-trust"><span><LockKeyhole size={17} /> Secure session cookies and server-side role checks</span><span><CircleCheck size={17} /> Generic responses protect account privacy</span></div>{creator && <p className="login-footnote">Not approved yet? <Link href="/creator/apply">Start your creator application.</Link></p>}</div></section>;
}

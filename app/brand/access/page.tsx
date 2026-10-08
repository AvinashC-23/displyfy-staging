import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { BrandAccessForm } from "@/components/forms/brand-access-form";

export const metadata: Metadata = { title: "Brand access" };

export default function Page() {
  return <><section className="entry-hero"><div className="shell entry-hero-grid"><div className="route-reveal"><p className="kicker">Brand access</p><h1>Start with a campaign creators can understand.</h1><p>Tell us about your business and intended work. We review brand access before mission creation so creators know who sits behind the brief.</p></div><div className="entry-art route-reveal"><Image src="/assets/editorial/creator-collaboration-editing.webp" alt="Two creators reviewing video footage at a worktable" fill preload sizes="(max-width: 900px) 100vw, 48vw" /></div></div></section>
    <section className="entry-principles"><div className="shell"><article><BriefcaseBusiness /><h2>Business context</h2><p>Company identity, website, contact role, launch market, and intended campaign help us assess access.</p></article><article><ShieldCheck /><h2>Mission review</h2><p>Every campaign brief is checked before it reaches creators, even after your brand account is approved.</p></article><article><BadgeCheck /><h2>Visible accountability</h2><p>Creator criteria, budget commitment, content decisions, metric sources, and payouts remain reviewable.</p></article></div></section>
    <section className="application-section"><div className="shell application-layout"><aside><p className="kicker">Request access</p><h2>Give us enough to review the fit.</h2><p>A work email helps establish context but is not treated as proof of brand ownership. Independent businesses can still apply.</p><p>Need a conversation first? Contact <a href="mailto:partnerships@displyfy.com"><strong>partnerships@displyfy.com</strong></a>.</p></aside><BrandAccessForm /></div></section>
  </>;
}

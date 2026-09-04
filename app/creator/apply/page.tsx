import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Eye, LockKeyhole, Sparkles } from "lucide-react";
import { CreatorApplicationForm } from "@/components/forms/creator-application-form";
import { PageMotion } from "@/components/page-motion";

export const metadata: Metadata = { title: "Creator application" };

export default function Page() {
  return <PageMotion><section className="entry-hero"><div className="shell entry-hero-grid"><div className="route-reveal"><p className="kicker">Creator application</p><h1>Bring the audience. Keep the creative instinct.</h1><p>Tell us what you make, where your audience finds you, and the typical reach of your Reels. We review every creator before mission access.</p></div><div className="entry-art route-reveal"><Image src="/assets/illustrations/creator-product-placement.webp" alt="Illustration of a creator recording product-placement content" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div></div></section>
    <section className="entry-principles"><div className="shell"><article><Eye /><h2>Your public work</h2><p>We review your public Instagram profile, categories, creative quality, and typical audience response.</p></article><article><LockKeyhole /><h2>Your password stays yours</h2><p>Displyfy never asks for your Instagram password or uses unofficial scraping to access private account data.</p></article><article><BadgeCheck /><h2>Approval before access</h2><p>Approved creators see missions that match their country, categories, permissions, and performance profile.</p></article></div></section>
    <section className="application-section"><div className="shell application-layout"><aside><p className="kicker">A thoughtful application</p><h2>Enough context to find the right work.</h2><p>Use accurate profile and performance information. You can choose missions after approval; applying here does not commit you to a campaign.</p><div className="application-note-list"><span><Sparkles size={17} /> Profile review, not follower count alone</span><span><Sparkles size={17} /> No guaranteed earnings claims</span><span><Sparkles size={17} /> Mission terms shown before acceptance</span></div></aside><CreatorApplicationForm /></div></section>
  </PageMotion>;
}

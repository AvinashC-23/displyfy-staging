import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CircleDollarSign, Eye, ShieldCheck } from "lucide-react";

type ContentBlock = { title: string; body: string };

export function InfoPage({ eyebrow, title, intro, image, imageAlt, imagePosition, sections, journey, statement, faqs, cta, secondaryCta }: {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  sections: ContentBlock[];
  journey: ContentBlock[];
  statement: string;
  faqs: ContentBlock[];
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}) {
  const icons = [BadgeCheck, ShieldCheck, Eye, CircleDollarSign];
  const principles = ["Creative stays creator-led", "Terms arrive before commitment", "Performance keeps its source", "Decisions remain reviewable"];
  return <>
    <section className="route-hero"><div className="shell route-hero-grid"><div className="route-hero-copy"><p className="kicker route-reveal">{eyebrow}</p><h1 className="route-reveal">{title}</h1><p className="route-reveal">{intro}</p><div className="route-actions route-reveal"><Link className="button acid" href={cta.href}>{cta.label}<ArrowRight size={18} /></Link><Link className="button glass" href={secondaryCta.href}>{secondaryCta.label}</Link></div></div><div className="route-hero-art route-reveal"><Image src={image} alt={imageAlt} fill preload sizes="(max-width: 900px) 100vw, 48vw" style={{ objectPosition: imagePosition }} /></div></div></section>
    <div className="route-marquee" aria-label="Displyfy principles"><div className="route-marquee-track">{Array.from({ length: 2 }).map((_, group) => <div className="route-marquee-group" aria-hidden={group === 1} key={group}>{principles.map((principle) => <span key={principle}>{principle}<i /></span>)}</div>)}</div></div>

    <section className="route-chapter"><div className="shell"><div className="route-section-heading"><p className="kicker">Made to remove guesswork</p><h2>Everything important is visible before the work begins.</h2></div><div className="route-bento">{sections.map((section, index) => { const Icon = icons[index % icons.length]; return <article className={`route-feature route-feature-${index + 1}`} key={section.title}><Icon size={25} /><h3>{section.title}</h3><p>{section.body}</p></article>; })}</div></div></section>

    <section className="route-statement"><div className="shell"><p>{statement}</p><span className="statement-image"><Image src="/assets/editorial/style-creator-natural-placement.webp" alt="" fill sizes="220px" /></span></div></section>

    <section className="route-chapter route-journey"><div className="shell route-journey-grid"><div className="route-journey-art"><Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 48vw" style={{ objectPosition: imagePosition }} /></div><div><p className="kicker">A clearer way through</p><h2>Your path from interest to outcome.</h2><div className="route-steps">{journey.map(item => <article key={item.title}><span /><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></div></div></section>

    <section className="route-chapter route-faq"><div className="shell route-faq-grid"><div><p className="kicker">Useful answers</p><h2>Know what happens before you commit.</h2></div><div>{faqs.map(item => <details key={item.title}><summary>{item.title}</summary><p>{item.body}</p></details>)}</div></div></section>

    <section className="route-cta"><div className="shell"><p className="kicker">Ready when the fit is right</p><h2>{title}</h2><p>{intro}</p><div className="route-actions"><Link className="button acid" href={cta.href}>{cta.label}<ArrowRight size={18} /></Link><Link className="button glass" href={secondaryCta.href}>{secondaryCta.label}</Link></div></div></section>
  </>;
}

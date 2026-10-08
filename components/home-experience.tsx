import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, Building2, CircleCheck, Eye, ShieldCheck, Sparkles, Target } from "lucide-react";

type MissionPreview = {
  id: string;
  brandName: string;
  name: string;
  objective: string;
  accessMode: string;
  visibility: string;
  requiredVisibilitySeconds: number;
  minimumQualifyingViews: string;
  maximumPayout: string;
};

const revealCopy = "Creative freedom becomes more valuable when every requirement, approval, performance signal, and payout decision is clear.";

export function HomeExperience({ mission }: { mission: MissionPreview }) {
  return <div className="home-experience">
    <section className="hero-v2">
      <div className="hero-backdrop" aria-hidden />
      <div className="hero-ambient" aria-hidden />
      <div className="shell hero-v2-grid">
        <div className="hero-v2-copy">
          <p className="kicker hero-reveal">Creator partnerships, built for both sides</p>
          <h1 className="hero-reveal">Creator partnerships that perform <em>for both sides.</em></h1>
          <p className="hero-v2-intro hero-reveal">Brands get accountable campaigns and creators keep the voice their audience trusts. One clear system for briefs, approvals, performance, and payout.</p>
          <div className="hero-v2-actions hero-reveal">
            <Link className="button acid" href="/brand/access">Launch a brand mission <ArrowRight size={18} aria-hidden /></Link>
            <Link className="button glass" href="/creator/apply">Join as a creator</Link>
          </div>
        </div>
        <div className="hero-portrait hero-reveal">
          <Image src="/assets/editorial/style-creator-natural-placement.webp" alt="Style creator filming a short video while adjusting an earring" fill preload sizes="(max-width: 900px) 88vw, 42vw" />
          <div className="portrait-caption"><span>Creative stays human</span><span>Performance stays accountable</span></div>
        </div>
      </div>
      <div className="signal-marquee" aria-label="Displyfy campaign principles"><div className="marquee-track">
        {Array.from({ length: 2 }).map((_, group) => <div className="marquee-group" aria-hidden={group === 1} key={group}><span>Creator led</span><i /><span>Brand accountable</span><i /><span>Performance verified</span><i /><span>Budget controlled</span><i /></div>)}
      </div></div>
    </section>

    <section className="chapter trust-chapter">
      <div className="shell">
        <div className="chapter-heading"><p className="kicker">Clarity earns trust</p><h2>A marketplace designed to protect both sides of the brief.</h2><p>Campaign expectations are visible before anyone commits. Approval, access, measurement, and payout status live in one accountable system.</p></div>
        <div className="trust-bento">
          <article className="bento-card bento-lead">
            <div className="bento-icon"><Building2 size={26} aria-hidden /></div>
            <div><p className="card-label">For brand teams</p><h3>Set the audience, creative boundaries, capacity, and maximum spend before a mission opens.</h3></div>
            <div className="bento-proof"><CircleCheck size={18} /><span>Every payout traces back to verified performance</span></div>
          </article>
          <article className="bento-card bento-image">
            <Image src="/assets/editorial/cooking-creator-natural-placement.webp" alt="Cooking creator filming a recipe with a product on the counter" fill sizes="(max-width: 900px) 100vw, 42vw" />
            <div className="image-wash" />
            <div className="bento-image-copy"><Sparkles size={24} /><h3>Brand presence that still feels native.</h3></div>
          </article>
          <article className="bento-card bento-creator"><ShieldCheck size={24} /><strong>Creator protected</strong><p>Requirements and earning rules are visible before a creator accepts.</p></article>
          <article className="bento-card bento-metric"><BarChart3 size={24} /><strong>Source-labeled</strong><p>Every performance snapshot records where the data came from.</p></article>
          <article className="bento-card bento-mark"><Image src="/brand/displyfy-mark-v3.svg" alt="" width={80} height={80} /><span>Reviewed before it runs</span></article>
        </div>
      </div>
    </section>

    <section className="chapter story-section">
      <div className="shell story-layout">
        <div className="story-sticky">
          <p className="kicker">Two sides. One standard.</p>
          <h2>Freedom for creators. Proof for brands.</h2>
          <p>Displyfy keeps the work expressive without making campaign operations vague.</p>
        </div>
        <div className="story-stack">
          <article className="story-card">
            <div className="story-media"><Image src="/assets/editorial/creator-collaboration-editing.webp" alt="Two creators reviewing a video together at a worktable" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="story-copy"><BadgeCheck size={25} /><h3>Know what you are funding.</h3><p>Brands define measurable missions with capacity, budget, brand-safety, creator criteria, and a documented verification path.</p><Link href="/for-brands">For brands <ArrowRight size={17} /></Link></div>
          </article>
          <article className="story-card">
            <div className="story-media"><Image src="/assets/editorial/fitness-creator-balcony.webp" alt="Fitness creator filming a mobility routine on a balcony" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="story-copy"><Target size={25} /><h3>Choose work that fits.</h3><p>Creators can assess the placement, creative restrictions, timeline, disclosure, and payout potential before accepting current terms.</p><Link href="/for-creators">For creators <ArrowRight size={17} /></Link></div>
          </article>
          <article className="story-card">
            <div className="story-media"><Image src="/assets/editorial/tech-creator-laptop-sticker.webp" alt="Tech creator filming a video beside an open laptop" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="story-copy"><Eye size={25} /><h3>Trust the trail.</h3><p>Admin review, metric source, status history, payout eligibility, and manual payment references remain auditable.</p><Link href="/how-it-works">How verification works <ArrowRight size={17} /></Link></div>
          </article>
        </div>
      </div>
    </section>

    <section className="chapter word-reveal-chapter"><div className="shell word-reveal">
      <p className="kicker">The operating principle</p>
      <p className="reveal-statement">{revealCopy.split(" ").map((word, index) => <span className="reveal-word" key={`${word}-${index}`}>{word}{" "}</span>)}</p>
      <div className="inline-visual" aria-hidden><Image src="/assets/editorial/travel-creator-bookshop-cafe.webp" alt="" fill sizes="240px" /></div>
    </div></section>

    <section className="chapter mission-chapter"><div className="shell">
      <div className="chapter-heading compact"><p className="kicker">A mission, made concrete</p><h2>Creators see the ask. Brands see the controls.</h2></div>
      <article className="mission-showcase">
        <div className="mission-visual"><Image src="/assets/editorial/tech-creator-laptop-sticker.webp" alt="Tech creator filming at a desk with a subtle laptop placement" fill sizes="(max-width: 900px) 100vw, 52vw" /></div>
        <div className="mission-content"><div className="mission-brand"><BadgeCheck size={18} /><span>{mission.brandName}</span></div><h3>{mission.name}</h3><p>{mission.objective}</p><dl><div><dt>Product visibility</dt><dd>{mission.requiredVisibilitySeconds} seconds</dd></div><div><dt>Qualifying views</dt><dd>{mission.minimumQualifyingViews}</dd></div><div><dt>Maximum payout</dt><dd>{mission.maximumPayout}</dd></div><div><dt>Access</dt><dd>{mission.accessMode}</dd></div><div><dt>Mission visibility</dt><dd>{mission.visibility.replaceAll("_", " ")}</dd></div></dl><Link className="button acid" href={`/creator/missions/${mission.id}`}>Explore this mission <ArrowRight size={18} /></Link></div>
      </article>
    </div></section>

    <section className="chapter accordion-chapter"><div className="shell">
      <div className="chapter-heading compact"><p className="kicker">Built into every campaign</p><h2>Confidence expands when the details are visible.</h2></div>
      <div className="horizontal-accordion">
        <article tabIndex={0}><div className="accordion-bg"><Image src="/assets/editorial/cooking-creator-natural-placement.webp" alt="Cooking creator filming with a product naturally in frame" fill sizes="(max-width: 760px) 100vw, 34vw" /></div><div className="accordion-copy"><span>Clear briefs</span><p>Placement and disclosure requirements are explicit before acceptance.</p></div></article>
        <article tabIndex={0}><div className="accordion-bg"><Image src="/assets/editorial/fitness-creator-balcony.webp" alt="Fitness creator filming a routine beside a placed product" fill sizes="(max-width: 760px) 100vw, 34vw" /></div><div className="accordion-copy"><span>Measured outcomes</span><p>Metrics are tied to a source and a defined campaign window.</p></div></article>
        <article tabIndex={0}><div className="accordion-bg"><Image src="/assets/editorial/creator-collaboration-editing.webp" alt="Creators reviewing footage at a worktable" fill sizes="(max-width: 760px) 100vw, 34vw" /></div><div className="accordion-copy"><span>Human review</span><p>Consequential approvals and payout decisions remain accountable.</p></div></article>
      </div>
    </div></section>

    <section className="chapter faq-chapter"><div className="shell faq-layout"><div><p className="kicker">Straight answers</p><h2>Before you join.</h2></div><div className="faq">
      <details><summary>Does joining guarantee earnings?</summary><p>No. Earnings depend on creator approval, mission eligibility, capacity, compliant submissions, and achieved performance milestones.</p></details>
      <details><summary>Do creators need to verbally endorse products?</summary><p>Not by default. Missions can focus on natural product or logo visibility. Any additional requirement must appear in the brief.</p></details>
      <details><summary>How are sponsored placements disclosed?</summary><p>Creators must follow mission instructions and applicable advertising rules, including clear labels or platform paid-partnership tools where required.</p></details>
      <details><summary>Can brands publish immediately?</summary><p>No. Brand access and each mission receive an administrator review before activation.</p></details>
    </div></div></section>

    <section className="final-cta"><div className="shell final-cta-inner"><p className="kicker">Attention should create value</p><h2>Make the next placement worth watching.</h2><p>Join a marketplace where creative work stays distinctive and campaign decisions stay defensible.</p><div className="hero-v2-actions"><Link className="button acid" href="/creator/apply">Apply as a creator</Link><Link className="button glass" href="/brand/access">Request brand access</Link></div></div></section>
  </div>;
}

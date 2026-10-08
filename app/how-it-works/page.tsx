import { InfoPage } from "@/components/info-page";

export default function Page() {
  return <InfoPage
    eyebrow="How Displyfy works"
    title="From a clear placement brief to verified creator value."
    intro="Displyfy makes paid product visibility easier to understand for creators and easier to account for across brand teams."
    image="/assets/editorial/tech-creator-laptop-sticker.webp"
    imageAlt="Tech creator recording a video beside an open laptop"
    cta={{ label: "Explore creator missions", href: "/creator/missions" }}
    secondaryCta={{ label: "Request brand access", href: "/brand/access" }}
    sections={[
      { title: "Reviewed participation", body: "Creators, brands, and campaign missions pass through explicit approval states before active work begins." },
      { title: "Visible mission terms", body: "The current creative ask, dates, access, disclosure, capacity, and payout logic stay attached to the mission." },
      { title: "Source-labeled proof", body: "Performance snapshots distinguish creator-supplied, brand-supplied, official, and manually reviewed metrics." },
      { title: "Auditable decisions", body: "Approvals, rejections, status changes, payout eligibility, and external payment references leave a history." }
    ]}
    statement="The product is not a promise that every post earns. It is a shared record of what was asked, what was published, what was verified, and what became payable."
    journey={[
      { title: "A brand publishes a reviewed mission", body: "The mission sets creator fit, creative boundaries, disclosure, capacity, budget, and payout milestones." },
      { title: "An eligible creator applies", body: "The creator opens the detailed brief, accepts its current terms, and reserves an available position." },
      { title: "The creator submits a public Reel", body: "Displyfy records the Reel URL, caption, publication date, disclosure confirmation, and creator notes." },
      { title: "Review turns activity into evidence", body: "Placement, disclosure, views, source, earning eligibility, and payout status are checked and recorded." }
    ]}
    faqs={[
      { title: "Why are some missions invitation only?", body: "A brand may need a narrow creator group for product availability, audience fit, confidentiality, or brand-safety reasons." },
      { title: "What happens when terms change?", body: "Creators must accept the current version. An outdated acceptance cannot be reused after mission terms are updated." },
      { title: "Who makes final approval decisions?", body: "The required decision path is defined by the mission. Administrators retain responsibility for consequential review and audit records." }
    ]}
  />;
}

import { InfoPage } from "@/components/info-page";

export default function Page() {
  return <InfoPage
    eyebrow="For creators"
    title="Keep your format. Choose better partnerships."
    intro="Discover paid product-placement missions that fit your audience, your categories, and the way you already create."
    image="/assets/editorial/travel-creator-bookshop-cafe.webp"
    imageAlt="Lifestyle creator filming in a bookshop café with a product nearby"
    imagePosition="22% center"
    cta={{ label: "Apply as a creator", href: "/creator/apply" }}
    secondaryCta={{ label: "Browse demo missions", href: "/creator/missions" }}
    sections={[
      { title: "See the full brief", body: "Placement, visibility time, disclosure, restrictions, deadlines, and earning milestones appear before you apply." },
      { title: "Protect your voice", body: "Choose work that belongs naturally inside your existing format instead of reading from a brand script." },
      { title: "Know what is measured", body: "Every performance result identifies whether it came from creator supply, brand supply, Meta, or manual review." },
      { title: "Follow the payout", body: "Track eligibility, review status, the amount earned, and the external payment reference in one place." }
    ]}
    statement="A good partnership should feel like content your audience would watch anyway, with commercial terms nobody has to decode."
    journey={[
      { title: "Build a reviewed profile", body: "Share your public Instagram identity, content categories, audience location, and typical Reel performance." },
      { title: "Open the mission like a product", body: "Compare the creative ask, creator fit, available spots, payout tiers, and timing before reserving work." },
      { title: "Publish, disclose, and submit", body: "Create in your own voice, use the required paid-partnership disclosure, and send the public Reel URL for review." },
      { title: "Watch the evidence move", body: "Placement review, verified views, earning milestones, and payout status remain visible throughout the campaign." }
    ]}
    faqs={[
      { title: "Does approval guarantee paid work?", body: "No. Approval lets you view eligible missions. Each opportunity still depends on fit, capacity, deadlines, access rules, and current terms." },
      { title: "Will brands control my script?", body: "Missions define placement and safety requirements. Any creative restriction must be visible in the brief before you apply." },
      { title: "Do I share my Instagram password?", body: "Never. Displyfy only requests public profile and Reel information unless an official Meta connection is introduced later." }
    ]}
  />;
}

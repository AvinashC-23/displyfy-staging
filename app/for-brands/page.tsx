import { InfoPage } from "@/components/info-page";

export default function Page() {
  return <InfoPage
    eyebrow="For brands"
    title="Put the product inside stories people chose to watch."
    intro="Turn a campaign idea into a creator-ready mission with visible controls, reviewable content, and accountable performance."
    image="/assets/editorial/creator-collaboration-editing.webp"
    imageAlt="Two creators reviewing a video together at a worktable"
    cta={{ label: "Request brand access", href: "/brand/access" }}
    secondaryCta={{ label: "See how verification works", href: "/how-it-works" }}
    sections={[
      { title: "Make the ask concrete", body: "Define where the product appears, how long it remains visible, what creators cannot show, and how disclosure works." },
      { title: "Choose the creator fit", body: "Set categories, countries, performance thresholds, access type, capacity, and approval requirements." },
      { title: "Review with evidence", body: "Inspect the public Reel, placement duration, disclosure, metric source, and performance snapshots before decisions." },
      { title: "Control commitment", body: "Reserve maximum payout against campaign budget so capacity and financial exposure stay understandable." }
    ]}
    statement="Creators should see a brief they can interpret. Brands should see a process they can defend. The campaign becomes stronger when both are true."
    journey={[
      { title: "Request and verify access", body: "We review the company, contact, ownership context, and intended campaign before activating brand tools." },
      { title: "Build the mission", body: "Describe the creative outcome, creator criteria, placement, disclosure, timing, capacity, and payout tiers." },
      { title: "Review before publishing", body: "An administrator checks the mission for clarity, budget coverage, safety, and creator-facing completeness." },
      { title: "Evaluate creator work", body: "Follow submissions and source-labeled performance while consequential decisions remain recorded." }
    ]}
    faqs={[
      { title: "Can we invite specific creators?", body: "Yes. Restricted missions support individually permitted creators and can require both brand and administrator approval." },
      { title: "Can a mission exceed its budget?", body: "Capacity and maximum payout commitments are checked together before another creator spot is reserved." },
      { title: "Are Instagram metrics automatic?", body: "The MVP uses clearly labeled manual review. An official Meta integration can be added later without changing the mission model." }
    ]}
  />;
}

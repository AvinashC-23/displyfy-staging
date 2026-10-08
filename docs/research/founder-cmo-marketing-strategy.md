# Displyfy Founder/CMO Marketing Strategy

**Date:** 21 September 2026

**Decision horizon:** 12 months

**Recommended launch posture:** India-first, invite-only, founder-operated, one product category at a time

**North star:** completed, compliant, paid creator placements that lead to repeat brand spend

## Executive decision

Displyfy should not launch as another broad “find influencers” marketplace. Meta, Shopify, TikTok, and specialist marketplaces already cover discovery, invitations, portfolios, affiliate tracking, and campaign management. Displyfy's most credible wedge is narrower:

> **The accountable product-placement network: creators keep their voice, brands know what they are funding, and every result has a visible path to payout.**

For the first six months, sell Displyfy as a **managed mission service powered by marketplace software**. Concentrate demand in one geography, one creator cohort, and one repeatable placement format. Recruit creators only for funded work. Turn every completed campaign into the next campaign's distribution through real Reels, a brand result, a creator story, and an optional source-labeled outcome card.

The first objective is not fame. It is proof:

- 5–10 paying design-partner brands;
- 30–50 carefully vetted nano/micro creators;
- 30 completed, disclosed, paid placements;
- at least 40% of pilot brands buying again;
- predictable mission fill, review, and payout times;
- positive contribution margin after founder/admin time.

If those conditions are not true, more awareness will create a larger operations problem rather than a healthier marketplace.

## What exists today: verified repository facts

- The public promise already contains the strongest brand territory: accountable campaigns, creator voice, clear briefs, performance, and payout ([homepage](../../components/home-experience.tsx#L90)).
- Missions make the ask unusually concrete: placement instructions, seconds of visibility, restrictions, disclosure, capacity, payout tiers, dates, and budget commitments are modeled in the product ([mission detail](../../components/mission-detail.tsx#L13), [types](../../lib/types.ts#L47)).
- Creator eligibility is currently based on approval, country, category, and a view threshold, which supports a curated niche launch better than a wide-open marketplace ([domain rules](../../lib/domain.ts#L32)).
- Creators can inspect payout logic before accepting work; brands can reserve maximum exposure against a budget ([mission detail](../../components/mission-detail.tsx#L24)).
- The trust layer is meaningful: source-labeled metrics, current terms acceptance, audit history, restricted permissions, and concurrency-safe capacity/budget controls are built into the model ([README](../../README.md#L52)).
- Acquisition is currently high-friction. The creator application asks for identity, account, contact, performance, password, description, and four agreements in one pass ([creator form](../../components/forms/creator-application-form.tsx#L21)). The brand form asks for ten fields before a prospect experiences a mission blueprint ([brand form](../../components/forms/brand-access-form.tsx#L21)).
- The MVP does not yet justify claims of automated verification or automated payment. Instagram performance is manually reviewed, payouts are an external ledger workflow, and production services still require configuration ([known limitations](../../README.md#L111)).
- There is no current referral model, acquisition attribution, public creator portfolio, shareable campaign result, or product analytics layer. Near-term growth loops therefore require both product work and careful consent design.

## Strategic assumptions

These recommendations assume:

1. The founder is based in or has strongest access to the Indian D2C and creator ecosystem.
2. The company can personally operate the first 10–20 campaigns.
3. Brands—not creators—will be the initial payer.
4. Creators will never pay to access ordinary missions.
5. Initial campaigns use Instagram Reels and physical products that can appear naturally in existing content.
6. Brand-funded creator payouts are separate from Displyfy's own marketing budget.

If the founder's strongest warm network is in another country or category, preserve the concentration strategy and change the location—not the strategy.

# Council Decision

## Recommendation

Launch a **Founding Missions** program for one cohort: design-led Indian D2C lifestyle, home, desk, and personal-accessory brands working with English/Hinglish nano- and micro-creators. Offer a five- or ten-creator mission with a guaranteed base fee plus transparent performance upside, founder-assisted briefing, manual review, and a source-labeled campaign recap.

Use the first 90 days to prove liquidity, trust, and repeat purchase. Do not spend meaningfully on broad paid acquisition, build a public creator directory, or promise automated verification before that proof exists.

## Confidence

**84%.** The product and external evidence strongly support a curated, proof-led entry. Confidence is limited by the absence of real customer interviews, pricing data, completed production campaigns, retention, and unit economics.

## Consensus

The council converged on six points:

- Demand is the marketplace bottleneck; funded missions should come before a large creator waitlist.
- The wedge is transparent, natural product placement with accountable operations—not creator search.
- A concierge launch fits the actual MVP and reduces cold-start risk.
- Real campaign evidence should replace illustration-heavy marketing as quickly as possible.
- Growth should be measured in completed paid placements and repeat brand spend, not registrations or social followers.
- Broad referral rewards, scraped outreach, and unqualified “verified” claims create more risk than value at this stage.

## Disagreements

- **Initial category:** workspace/home/lifestyle has the cleanest fit with the current product and lowest claim risk; beauty/fashion may have larger creator supply but more competition and content-rights complexity. The recommendation favors the former until interviews show materially stronger demand elsewhere.
- **Referral timing:** growth-oriented reviewers see a creator referral loop as cheap acquisition; engineering and privacy reviewers recommend waiting until there is reliable paid inventory, attribution, consent, and fraud review. The latter argument is stronger.
- **Pricing:** a percentage take rate is easy to explain, but a managed launch needs a minimum service fee to cover human work. Exact levels require paid discovery, not guesswork.
- **Brand personality:** an irreverent social voice can earn reach, but “unhinged brand” imitation would weaken a company selling trust. The brand should be lively and culturally literate, with evidence staying sober.

## Strongest Case For

Displyfy resolves a real coordination failure on both sides. Brands need a brief they can defend; creators need visible terms and payment logic without surrendering their voice. The product already models the operational detail that generic discovery platforms often leave to DMs and spreadsheets. A narrow managed offer can create valuable proof before expensive automation.

## Strongest Case Against

Brands already have direct outreach, agencies, Meta's native marketplace, Shopify Collabs, and established creator platforms. Creators care first about quality deal flow and prompt payment, not an elegant audit trail. Unless Displyfy produces repeat brand spend and materially better creator experiences, the workflow is reproducible and the marketplace will remain thin.

## Major Risks

- Two-sided cold start and double acquisition cost.
- Manual review, metrics, disputes, and payout reconciliation becoming the scaling bottleneck.
- View-based bonuses attracting cheap reach rather than commercial impact.
- “Verified performance” being interpreted as automated or independently audited.
- Late payment, vague usage rights, or one unsafe brief reversing the trust story.
- Public profiles, referral tracking, bulk outreach, or content reuse outrunning consent and privacy controls.
- Platform dependency on Instagram policies, reach, and future API access.
- The name “Displyfy” being misspelled or misheard; test unaided spelling recall before investing heavily in brand awareness.

## What We Don't Know

- Which vertical has the founder's strongest unfair access.
- What brands will actually pay and which budget owner signs.
- Whether they value posted reach, reusable UGC, partnership-ad rights, sales, or brand lift most.
- Whether creators accept performance-tier compensation without a guaranteed base.
- Median manual operating time and cost per placement.
- Mission fill rate, compliant completion rate, payout disputes, and repeat purchase.
- Whether “mission,” “source-labeled,” and “verified” are understood without explanation.

## What Would Change The Decision

- Strong paid demand in another vertical would change the launch niche.
- Brands repeatedly asking only for reusable UGC would shift the product from placement marketplace toward a content-production network.
- Creator resistance to performance exposure would make base-fee-only or base-plus-small-bonus pricing the default.
- Manual operations above roughly two hours per completed placement would move automation and workflow queues ahead of acquisition.
- Fewer than two repeat purchases from the first five brands would trigger a positioning, outcome, and offer review before further growth spend.

## Next Action

Run a **14-day Founding Mission sprint**: choose one niche, interview 10 brands and 15 creators, pitch 30 qualified brands with personalized mission concepts, and close three paid pilot missions before opening broad creator acquisition.

## Brand foundation

### The enemy

Creator advertising became a choice between two bad systems: scripted content audiences ignore, or informal DMs where nobody is sure what was agreed, measured, or owed.

### The founder story

> Brands should not have to gamble on a vague post. Creators should not have to trade their voice for a vague payment promise. Displyfy was built to make the commercial part clear so the creative part can stay human.

### Brand purpose

Make creator partnerships worth watching—and easy to account for.

### Positioning statement

For growing consumer brands and independent creators who want natural product placement without messy DMs or scripted endorsements, Displyfy turns a campaign idea into a clear mission with visible terms, creator fit, source-labeled results, and traceable payout decisions.

### Message hierarchy

1. **Category:** The accountable marketplace for creator-native product placement.
2. **Primary tagline to test:** Fits the story. Clear in the record.
3. **Master promise:** Creator-led product placement, with terms up front and proof behind every payout.
4. **Creator campaign line:** Freedom for creators. Proof for brands.
5. **Brand benefit:** Set the rules. See the source. Defend the decision.
6. **Creator benefit:** See the full ask. Keep your format. Follow your payout.
7. **Trust proof:** Every metric names its source; every payout decision leaves a trail.
8. **Important qualifier:** Manual where manual. Official where official. Always labeled.

### Values expressed as behaviors

- **Clarity before commitment:** no hidden requirements, fees, rights, or payout rules.
- **Creative sovereignty:** define non-negotiables, not scripts.
- **Evidence with provenance:** say where every metric came from and when it was reviewed.
- **Commercial fairness:** guarantee a base for required work; use performance as upside.
- **Earned trust:** do not claim scale, automation, or outcomes that do not yet exist.

### Voice

Displyfy should sound like a sharp, fair operator who understands creator culture—not an ad-tech dashboard and not a talent agency promising fame.

- Direct: “Here is the ask. Here is the payout. Here is what gets reviewed.”
- Human: “Make it fit your format.”
- Specific: use seconds, dates, sources, and payout milestones.
- Witty in culture content; sober in money, policy, and evidence.
- Avoid “revolutionary,” “seamless,” “guaranteed virality,” “AI-powered matching,” and vague “authenticity.”

### Visual behavior

The existing mark already combines a D, video frame, and verified placement tile ([brand rationale](../../../assets/brand/README.md)). Keep ink as the authority color, signal lime for opportunity/action, and teal for provenance/confirmation. The signature visual should be a four-frame evidence strip:

`THE BRIEF → THE CREATOR CUT → THE RESULT → THE PAYOUT`

Once real pilots exist, real creator frames and campaign artifacts should displace most generic illustrations.

### Signature brand properties

- **The Brief vs. The Reel:** show what the brand required and how the creator interpreted it.
- **Brief Court:** founder-led teardown of unclear briefs, rewritten fairly.
- **Placement Challenge:** “Can this product appear naturally in eight seconds?”
- **The Placement Receipt:** a permissioned, privacy-safe card showing the ask, disclosure, metric source, achieved tier, decision, and payout timing.
- **Source Check:** a repeatable explainer distinguishing creator-supplied, brand-supplied, manual-review, and official-platform data.
- **Mission Room:** small offline/online sessions where a brand and creators build one brief together.

Campaign line: **Good placement shouldn't need a script. Good payment shouldn't need a chase.**

## Initial market and offer

### Recommended beachhead

Start with **English/Hinglish Instagram creators in India who make workspace, home, everyday-lifestyle, and personal-accessory Reels**, and the design-led D2C brands whose products naturally belong in those scenes.

Why this niche:

- It matches the product's existing natural-placement examples.
- Products are easy to ship and visually demonstrate.
- It avoids some health, finance, nutrition, and efficacy-claim risks.
- The same creator can plausibly run multiple non-competing missions.
- Placements can be judged on visibility and integration without forcing testimonials.

Do not launch “India + US + UK” or “fashion + food + tech + fitness” simultaneously. Density beats breadth.

### Brand ICP

- Founder-led or lean marketing team.
- Visually distinctive physical product.
- Already publishing Reels or buying creator/UGC work.
- Can fund at least five creator placements and ship samples on time.
- Feels pain around outreach, brief quality, tracking, review, or payout operations.
- Has a campaign decision-maker reachable through founder-led sales.

### Creator ICP

- Roughly 5,000–100,000 followers, but selected on consistent relevant views and content quality rather than follower count.
- Publishes at least weekly in the chosen niche.
- Demonstrates natural product use, reliable communication, and compliant disclosure.
- Audience geography matches brand shipping and campaign goals.
- Will share metrics and accept a clear review process without providing passwords.

### Founding Mission offer

Package the service, not software features:

1. 30-minute mission blueprint.
2. Clear brief, exclusions, disclosure, content rights, dates, base payout, and bonus.
3. Five or ten vetted creators.
4. Manual application and content review.
5. Source-labeled performance snapshot.
6. Payout reconciliation and a one-page outcome report.
7. One repeat-mission recommendation.

### Pricing hypothesis to test

- Creators: free access; **guaranteed base payment plus optional performance upside**.
- First three design partners: creator budget + ₹15,000–₹25,000 managed-pilot fee, discounted only in exchange for structured feedback and permission to publish a case study.
- After operational proof: creator budget + the greater of a 12–15% campaign fee or a ₹25,000 minimum management fee.
- Usage rights, whitelisting/partnership-ad rights, exclusivity, and extra revisions are priced separately and agreed before acceptance.

This is a hypothesis, not a market fact. For context, JoinBrands publicly lists a 15% pay-as-you-go brand fee while Shopify Collabs is free to install and monetizes payment processing; those offers make price competition unattractive ([JoinBrands](https://joinbrands.com/pricing/), [Shopify Collabs](https://www.shopify.com/collabs/find-influencers)). Displyfy must charge for managed assurance and a distinct placement workflow, not database access.

## What recent breakout apps teach us

### 1. Partiful: the output is the acquisition surface

**Verified facts:** Google named Partiful its Best App of 2024, highlighting fast invite creation and link-based RSVP. Partiful's own product lets an event page travel through text, social, and email, and its stated mission is about real-world gathering rather than event-management software ([Google Play](https://blog.google/products-and-platforms/platforms/google-play/google-play-best-apps-games-2024/), [Partiful](https://partiful.com/about), [Partiful sharing guidance](https://help.partiful.com/en-us/articles/15525323-how-many-guests-can-i-invite)).

**Transfer to Displyfy:** every funded mission should have a beautiful public teaser page that can be opened without an account: product, creator fit, base/bonus range, deadline, spots, and a lightweight fit check. A brand can invite creators directly; creators can share a mission with a relevant peer. The mission itself distributes the marketplace.

### 2. Airbuds: recurring identity artifacts and referrals tied to real utility

**Verified facts:** Airbuds generates a weekly music recap designed for sharing and grants feature credits when a referred friend actually joins. It also runs a paid campus ambassador program around events and social content ([weekly recap](https://help.airbuds.fm/en/articles/33-weekly-recap), [referral unlock](https://help.airbuds.fm/en/articles/39-unlock-custom-reactions), [ambassador program](https://airbudswidget.com/)).

**Transfer to Displyfy:** create a weekly/monthly creator “work receipt” and a campaign recap that people want to share because it signals professional progress. Unlock rewards only after a meaningful event: the referred creator completes a compliant paid mission, or the referred brand funds one. Never force invitations before users receive value.

### 3. Duolingo: entertainment earns attention; product delight retains it

**Verified facts:** Duolingo's filings describe entertaining rather than promotional social content, participation in viral trends, community meme amplification, localized influencer campaigns, and product-led engagement. Its Q3 2025 shareholder letter also records a slowdown when it reduced its “unhinged” posting, while cautioning that long-term growth comes from a better product ([2023 filing](https://investors.duolingo.com/static-files/06078a85-5de8-4c86-9a6a-7036259b07a4), [Q3 2025 letter](https://investors.duolingo.com/static-files/c9bf5861-b19d-4396-b060-c0dbeefd34f5)).

**Transfer to Displyfy:** run an entertainment/editorial channel about creator-brand culture, not a stream of feature launches. “Brief Court” can become a recognizable series. Build lore around recurring situations—vague rights, nine-round revisions, buried #ad, mystery payouts—not a borrowed cartoon mascot. Social reach can accelerate acquisition, but the product must deliver missions and prompt payment.

### 4. Cal AI and visual-demo apps: compress value into seconds

**Verified facts:** Cal AI's current App Store listing shows a large rating base and an immediately demonstrable workflow: photograph a meal and receive a nutritional breakdown ([App Store](https://apps.apple.com/us/app/cal-ai-calorie-tracker/id6480417616)). Acceptable primary sources do not disclose its exact acquisition mix, so claims that a particular influencer tactic caused its growth should be treated as unverified.

**Transfer to Displyfy:** the product needs a five-to-ten-second visual proof: vague brand idea becomes a mission card; creator makes a native Reel; a source-labeled result unlocks payout. If a feature cannot improve that story, it is probably not a launch priority.

### 5. Widgetable and collaboration-native products: the other participant is distribution

**Verified fact:** Widgetable's core experiences—shared pets, moods, status, and widgets—require another person, and its Google Play listing shows large-scale adoption ([Google Play](https://play.google.com/store/apps/details?id=com.widgetable.theme.android)). The listing proves scale and product mechanics, not a causal marketing model.

**Transfer to Displyfy:** each campaign should create a co-owned object that both brand and creator can share: approved mission card, launch moment, result recap, or paid-completion badge. Sharing must be optional and rights-cleared.

### Competitive conclusion

Meta's creator marketplace already offers creator portfolios, search/filtering, project briefs, rates, direct messaging, and partnership ads, including expansion into India ([Meta](https://about.fb.com/news/2024/02/creator-marketplace-for-brands-and-creators-to-collaborate-on-instagram/)). Shopify Collabs offers direct invites, open programs, tracked sales, gifts, and automatic commissions ([Shopify](https://www.shopify.com/collabs/find-influencers)). Therefore:

> **Do not market “find creators.” Market “run a clear, fair, accountable placement mission.”**

## Growth system

### Loop 1: mission-to-creator

`Funded mission → shareable mission page → qualified creator applies → Reel goes live → creator gets paid → creator refers one relevant peer`

Build requirements:

- campaign-specific landing pages;
- no-login public teaser and short fit check;
- source/UTM capture;
- progressive creator onboarding;
- referral qualification only after paid completion.

### Loop 2: result-to-brand

`Completed placements → source-labeled recap → founder publishes case study → similar brand requests blueprint → new funded mission`

Every case study must show the brief, creator selection, content, metric source, creator payment, brand outcome, and limitation—not views alone.

### Loop 3: content-to-community

`Real marketplace problem → Brief Court/Placement Challenge post → useful debate/save/share → office hours or mission page → qualified lead`

Content ratio:

- 35% brief and campaign teardowns;
- 25% real mission/result stories;
- 20% creator economics, rights, disclosure, and payment education;
- 10% founder build-in-public lessons;
- 10% direct product/mission announcements.

### Loop 4: creator-to-brand

Let qualified creators nominate products they already use. A nominated brand receives a small “three natural placements” concept board, not a generic invitation. Reward the creator with priority access or a transparent referral credit only after the brand funds work.

## Channel plan

### Founder-led brand acquisition

Priority order:

1. Warm intros from D2C founders, marketers, agencies, accelerators, investors, and creator managers.
2. Personalized LinkedIn/email outreach with three concrete placement ideas for one product.
3. Small “Mission Room” roundtables with 5 brands and 10–15 creators.
4. Partnerships with D2C communities, coworking spaces, Shopify implementers, and boutique agencies.
5. Retargeting only after real case-study traffic converts.

Do not buy generic lead lists or send bulk WhatsApp/SMS. Use public business contacts, explain relevance and identity, and honor opt-outs.

### Creator acquisition

Priority order:

1. Personal Instagram DMs tied to a real funded mission.
2. Referrals from creators who completed and were paid for a mission.
3. Category-specific open calls and creator office hours.
4. Partnerships with small creator communities, college media clubs, and local production groups.
5. Searchable educational content: fair rates, usage rights, disclosure, and brief checklists.

Avoid a giant pre-launch creator waitlist. An approved creator with no credible work is a future detractor.

### Organic editorial calendar

Minimum sustainable cadence: three strong posts per week.

- Tuesday: **Brief Court** carousel/Reel.
- Thursday: **The Brief vs. The Reel** or creator craft lesson.
- Saturday: founder observation, mission call, or source-labeled outcome.
- Monthly: live **Mission Room** or creator/brand office hours.

Publish native versions for Instagram and LinkedIn; repurpose winners to YouTube Shorts. Do not manufacture seven mediocre posts a week.

## Outreach scripts

### Brand message

**Subject:** Three creator-native placements for `[product]`

> Hi `[name]`—I noticed `[specific product/campaign observation]`. I sketched three ways it could appear naturally in `[creator niche]` Reels without turning into a scripted endorsement. Displyfy runs small, reviewed creator missions with the brief, base payout, performance upside, disclosure, and result source visible from the start. We are opening a few founder-operated pilots. Would a 20-minute mission blueprint be useful next week?

### Creator DM

> Hey `[name]`—your Reel about `[specific post]` is exactly the kind of format this paid `[category]` mission should fit into. The brand's ask, restrictions, base payout, upside, dates, and disclosure are visible before you accept. No joining fee and no Instagram password. Want the mission preview?

### Referral ask after payout

> You completed the mission and the payout is recorded. If one creator in your niche would genuinely fit the next brief, send them this private preview. If they complete a paid mission, you both receive `[clearly stated non-cash or fee-credit reward]`.

## 12-month roadmap

### Days 0–14: choose the wedge and sell before scaling

Actions:

- Interview 10 brands and 15 creators in one niche.
- Test three positioning lines and the spelling/pronunciation of Displyfy.
- Define base-pay, bonus, usage-rights, disclosure, review, cancellation, and payout terms.
- Build a 50-account brand list and 40-creator shortlist manually.
- Create one sample mission page and a 10-second brief-to-payout demo.
- Pitch 30 brands; close three paid design partners.

Gate: do not open broad creator applications until at least one mission is funded.

### Days 15–45: run the first missions manually

Actions:

- Recruit 30 creators against funded briefs.
- Run three five-creator pilots.
- Track every conversion and every founder/admin minute.
- Pay the guaranteed base on the promised schedule.
- Collect explicit permission separately for logo, quote, Reel, and result reuse.
- Interview every participant after completion.

Targets:

- 70%+ of accepted spots publish compliant work;
- median mission fill under seven days;
- zero unclear-payment disputes;
- payout within seven days of completed review.

### Days 46–90: manufacture proof, not hype

Actions:

- Reach 30 cumulative paid placements.
- Publish three end-to-end case studies and 12 short-form variants.
- Launch public mission teasers and progressive creator onboarding.
- Add first-party attribution and operational funnel reporting.
- Build permissioned outcome cards showing metric source.
- Ask every pilot brand to rerun or expand one mission.

Gate: no more than ₹10,000/month in paid distribution until two brands repeat.

### Months 4–6: create repeatability

Actions:

- Productize 5- and 10-creator packages.
- Add brand/creator action queues, review SLAs, campaign recaps, content-rights fields, and payout reminders.
- Pilot creator referral rewards only after paid completion.
- Build a small advisory circle: three creators, three brand operators, one compliance specialist.
- Retarget visitors to case studies and mission blueprints; boost only organically proven creator content through official partnership-ad tools.

Targets:

- 8–12 cumulative paying brands;
- 50+ completed placements;
- 40%+ pilot-brand repeat rate;
- 80%+ compliant completion among accepted creators;
- positive contribution margin on repeat missions.

### Months 7–9: deepen the niche

Actions:

- Build benchmarks by placement format, not vanity follower tiers.
- Launch quarterly “State of the Clear Brief” insights from anonymized platform data.
- Run one monthly Mission Room with partners.
- Recruit a part-time campaign operator only when revenue covers the role.
- Add one adjacent product category only if the original category maintains liquidity.

Gate: expand only when a new category can begin with three funded brands and 30 qualified creators.

### Months 10–12: scale the proven channel

Actions:

- Formalize agency/referral partners with clear attribution and no hidden creator fees.
- Localize the winning editorial format and mission pages.
- Add official platform integrations only where they reduce operating cost or improve evidence.
- Test one additional city/language or one adjacent vertical—not both at once.
- Publish an annual proof report with limitations and source methodology.

Indicative targets:

- 20–25 active paying brands;
- 150+ cumulative completed placements;
- 200 curated creators with meaningful mission availability;
- 50%+ repeat revenue;
- median verified-to-paid time under seven days.

These are operating targets, not forecasts; revise them after the first three pilots.

## Lean budget

Creator compensation and product shipping should be funded inside each brand campaign. The table below is Displyfy's own monthly marketing/operations budget.

| Item | Days 0–45 | Days 46–90 | Months 4–6 |
| --- | ---: | ---: | ---: |
| CRM, email, forms, analytics | ₹3k–₹6k | ₹5k–₹8k | ₹8k–₹12k |
| Content editing/design support | ₹5k–₹12k | ₹12k–₹20k | ₹15k–₹25k |
| Small Mission Room/community event | ₹0–₹8k | ₹8k–₹15k | ₹10k–₹20k |
| Referral/creator recognition | ₹0 | ₹3k–₹8k | ₹8k–₹15k |
| Paid retargeting/boosting winners | ₹0 | ₹0–₹10k | ₹10k–₹25k |
| **Monthly total** | **₹8k–₹26k** | **₹28k–₹61k** | **₹51k–₹97k** |

The default should be the low end. Spend moves up only after a funded mission, a completed placement, and a measurable channel conversion. A one-time founder learning subsidy can support the first pilots, but never hide unviable creator economics from brands.

## Measurement system

### North star

**Completed paid placements per month**, with a companion measure of **repeat brand revenue**.

### Brand funnel

`Qualified accounts → replies → blueprint calls → funded missions → completed missions → repeat missions`

Track:

- qualified reply rate;
- blueprint-to-funded conversion;
- cash acquisition cost per funded brand;
- average creator budget and Displyfy revenue;
- gross margin after human operating time;
- 60- and 90-day brand repeat rate.

### Creator funnel

`Invited → preview opened → fit check → approved → accepted spot → compliant Reel → verified → paid → referred`

Track:

- time to first relevant mission;
- acceptance and completion rate;
- revisions per Reel;
- time from submission to decision and from verification to payout;
- creator NPS/trust interview themes;
- referred creators who complete paid work—not raw invite count.

### Marketplace health

- mission fill time;
- qualified applicants per spot;
- percent of approved creators receiving a relevant opportunity each month;
- fraud/dispute/takedown rate;
- source mix of performance data;
- concentration of brand spend and creator earnings;
- contribution margin per placement.

### Stop/go rules

- **Stop broad acquisition** if fewer than 70% of accepted spots complete.
- **Pause referrals** if inventory is insufficient or abuse exceeds 2% of qualified events.
- **Rework the offer** if fewer than 2 of the first 5 brands repeat within 90 days.
- **Automate the bottleneck** if manual effort exceeds two hours per completed placement.
- **Do not expand categories** until the original niche has predictable fill, completion, payout, and positive repeat economics.

## Trust, privacy, and disclosure guardrails

- Use low-volume personalized outreach, not scraped bulk SMS/WhatsApp.
- Separate service notifications from optional marketing consent by channel and purpose.
- Make public creator portfolios explicit opt-in with field-level preview and revocation.
- Collect separate rights for reposting content, using logos/quotes, paid amplification, and case studies.
- Label every metric as creator-supplied, brand-supplied, manually reviewed, or official platform data.
- Use clear `#ad`/paid-partnership disclosures and market-specific templates. ASCI states that material connections—including gifts—require clear disclosure in India ([ASCI guidelines](https://www.ascionline.in/the-asci-code-guidelines/)). India's Department of Consumer Affairs says video disclosures should appear in both audio and video and be clear, prominent, and hard to miss ([Government of India](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1904528&lang=2&reg=48)). The FTC likewise requires compensated endorsements and material connections to be disclosed in the US ([FTC](https://www.ftc.gov/news-events/topics/truth-advertising/advertisement-endorsements)).
- Define cancellation, revision, content-removal, metric-dispute, and payout-dispute paths before scaling.
- Keep referral rewards manual and non-cash initially; add anti-self-referral and duplicate-account controls before monetary incentives.

This is operational strategy, not jurisdiction-specific legal advice. Launch-market terms and privacy/disclosure flows require qualified counsel.

## What not to do

- Do not market to “all brands and all influencers.”
- Do not buy creators before paid mission inventory exists.
- Do not force Displyfy watermarks into creator content.
- Do not use fake live counters, demo data, or generated testimonials as social proof.
- Do not equate views with sales or promise ROAS the product cannot measure.
- Do not charge creators for ordinary access or make referrals a prerequisite for work.
- Do not copy Duolingo's tone without a brand truth that earns it.
- Do not subsidize every campaign to manufacture traction.
- Do not build a public creator directory by exposing private profile records.
- Do not expand geography, category, and platform in the same quarter.

## Research limits

- App-store rating counts are evidence of visible scale, not verified download or revenue figures.
- Product mechanics can support a growth inference without proving causality. Partiful, Airbuds, Widgetable, and Cal AI do not publicly disclose complete acquisition funnels.
- Duolingo's filings establish its stated marketing approach and growth, but social content alone cannot be credited for company performance.
- Repository demo missions and submissions are product examples, not customer traction.
- Pricing and targets in this document are hypotheses to test with real buyers.

## Sources

Primary or first-party sources were favored for all load-bearing claims:

- [Google Play Best Apps and Games of 2024](https://blog.google/products-and-platforms/platforms/google-play/google-play-best-apps-games-2024/)
- [Partiful About](https://partiful.com/about)
- [Partiful Year in Review 2024](https://partiful.com/blog/post/2024-year-in-review)
- [Airbuds Weekly Recap](https://help.airbuds.fm/en/articles/33-weekly-recap)
- [Airbuds Referral Unlock](https://help.airbuds.fm/en/articles/39-unlock-custom-reactions)
- [Airbuds Ambassador Program](https://airbudswidget.com/)
- [Duolingo filing: sales and marketing approach](https://investors.duolingo.com/static-files/06078a85-5de8-4c86-9a6a-7036259b07a4)
- [Duolingo Q3 2025 shareholder letter](https://investors.duolingo.com/static-files/c9bf5861-b19d-4396-b060-c0dbeefd34f5)
- [Meta Creator Marketplace expansion](https://about.fb.com/news/2024/02/creator-marketplace-for-brands-and-creators-to-collaborate-on-instagram/)
- [Meta on India's Reels and creator ecosystem](https://about.fb.com/news/2025/04/partnering-with-indias-agency-ecosystem-to-build-agencies-of-the-future/)
- [Shopify Collabs](https://www.shopify.com/collabs/find-influencers)
- [JoinBrands pricing](https://joinbrands.com/pricing/)
- [ASCI Influencer Advertising Guidelines](https://www.ascionline.in/the-asci-code-guidelines/)
- [Government of India endorsement guidance](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1904528&lang=2&reg=48)
- [FTC endorsement guidance](https://www.ftc.gov/news-events/topics/truth-advertising/advertisement-endorsements)
- [Cal AI App Store listing](https://apps.apple.com/us/app/cal-ai-calorie-tracker/id6480417616)
- [Widgetable Google Play listing](https://play.google.com/store/apps/details?id=com.widgetable.theme.android)

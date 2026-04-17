# TradeStash Research

Research date: April 14, 2026

This file covers:

- asset gaps for the marketing site and launch materials
- prompt-ready imagery and video requests
- competitor status notes
- legal flags for attorney review
- campus ambassador pattern research
- target-campus prioritization

## Asset Gaps

### 1. Lifestyle photography

Missing:

- real or generated shots of college students trading books, electronics, sneakers, dorm goods
- HBCU and PWI campus energy shots that feel urban, social, and non-corporate
- close-up trade handoff shots for ads, App Store, and social cutdowns

Midjourney prompt set:

```text
two college students in a campus setting exchanging a laptop bag, candid style, warm natural light, diverse cast, documentary realism, subtle streetwear styling, shallow depth of field, modern East Coast campus background, no visible brand logos
```

```text
group of college students on dorm move-out day trading mini fridge, sneakers, textbooks, and a desk lamp, energetic candid photography, warm golden hour, authentic campus setting, DMV region vibe, editorial streetwear aesthetic
```

```text
close-up of two students swapping a Nintendo Switch and a pair of headphones across a campus bench, hands in focus, urban collegiate mood, warm sunlight, premium lifestyle campaign photography
```

### 2. Hero image

Missing:

- phone mockup showing the actual TradeStash UI
- one clean vertical hero render for the landing page
- one tilted collage-style render for paid social and investor decks

Prompt after UI is final:

```text
high-end phone mockup showing a dark-mode barter marketplace app called TradeStash, neon green and electric orange accents, bold gamified leaderboard UI, listing cards for electronics and sneakers, urban editorial product render, soft reflections, premium startup campaign aesthetic
```

### 3. City skyline cards

Missing:

- consistent skyline art for Washington, DC
- Baltimore
- Richmond
- College Park

Prompt template:

```text
stylized urban skyline of [CITY], dusk lighting, bold editorial travel-poster style, dark mood with neon green highlight accents, clean silhouette composition, modern flat-shaded depth, optimized for web card background
```

### 4. Category icons

Missing:

- Electronics
- Clothing
- Books
- Furniture
- Games
- Sports
- Collectibles
- Other

Prompt:

```text
flat design icon set for a barter marketplace app, categories: electronics, clothing, books, furniture, games, sports, collectibles, other, consistent line weight, rounded corners, bold geometric silhouettes, dark-mode friendly, neon green and electric orange accent system, transparent background
```

### 5. Video assets

Missing:

- 15-second homepage hero loop
- campus ambassador recruiting teaser
- short paid social vertical cut for launch ads

Veo / Flow prompts:

```text
15-second cinematic hero loop, dormant dorm room items sitting unused, phone lights up with a trade notification, quick cuts of two college students meeting outside on campus and exchanging items successfully, energetic pacing, no dialogue, natural lighting, modern college fashion, premium ad spot feeling
```

```text
campus ambassador recruiting teaser, energetic college scenes across HBCU and PWI campuses, leaderboard graphics overlaid in the environment, students posting listings and celebrating completed trades, message: Your campus, your leaderboard. Be the Legend. no dialogue, bold sound-design-friendly visual pacing
```

## Competitive Landscape

### Bunz Trading Zone

Current status:

- Bunz is still live and publicly accessible in 2026.
- The official FAQ presents Bunz as a community trading platform using BTZ, an internal trade currency.
- Public profiles are still visible, which suggests the marketplace is operating and user activity still exists.

What appears to have failed or become risky:

- Bunz added a platform-specific currency layer instead of keeping trades purely intuitive.
- The FAQ explicitly says BTZ has no external market value and would lose utility if Bunz shut down.
- Bunz also introduced a recurring "Sherpa Cut" fee in BTZ, which adds system complexity and potential user distrust.

What TradeStash should do differently:

- stay cashless for trades, but avoid a synthetic internal currency for core swapping
- make reputation legible through XP, tiers, and reviews instead of token balances
- focus on dense local college markets first instead of broad undifferentiated geography
- keep the ask simple: list an item, offer an item, message, meet, complete

### Swap.com

Current status:

- Swap is still online, but it is not functioning as a barter marketplace.
- The indexed official site describes itself as an affordable liquidation apparel and shoe store.
- During this review, direct browsing of `swap.com` redirected unexpectedly, while search indexing still showed a low-inventory message and "More Product Coming Soon."

What appears to have failed or changed:

- the product moved away from peer-to-peer barter into standard resale / liquidation ecommerce
- the current site messaging suggests inventory instability or storefront transition
- the brand no longer solves local peer trade coordination

What TradeStash should do differently:

- keep the identity centered on trade, not resale
- prioritize local trust, not warehouse-style inventory
- own the social loop with XP, city leaderboards, and campus identity

### Listia

Current status:

- Listia is active in 2026.
- The homepage still shows current listings and states "Over 10 Million Members."
- Listia positions itself as a marketplace where users get items using Points instead of money.
- Help articles updated in 2023-2024 still explain sign-up, listing creation, and account verification.

What appears to have failed or aged:

- the model is closer to remote points-based auctions than local item swapping
- shipping friction remains central to the experience
- verification exists, but the strongest badge is staff-assigned, not broadly earned
- the product is not organized around campus density, real-world meetups, or city-level reputation

What TradeStash should do differently:

- default to nearby trades instead of shipping-first behavior
- make search and categories local and immediate
- turn trust into a visible city/campus reputation graph
- use async messaging and trade threads rather than generic listing/auction behavior

### Active barter-style apps worth watching

#### Swapsies

- Swapsies is active and markets itself as a local bartering app.
- The product framing is broad: local item exchange, sustainability, and secondhand discovery.
- This is useful proof that local barter still has demand.

Gap vs. TradeStash:

- not obviously college-first
- no clear public reputation ladder
- no city/campus leaderboard identity

### TradeStash differentiation summary

TradeStash should position against this whole category with five sharp differences:

1. Local density first: college campuses and surrounding neighborhoods, not everyone everywhere.
2. No fake money for core trades: reputation and status are earned socially, not abstracted into platform currency.
3. Gamified trust: XP, streaks, legend tiers, and city leaderboards make reliability visible.
4. Search that actually works: title/category intent and boosted relevance, not generic browse clutter.
5. Delivery hook as optional upside: trades can stay peer-to-peer, but logistics can appear when needed.

## Legal Flags

This section is not legal advice. It is a product-scoping memo for attorney review.

### High-level read

The state marketplace-facilitator rules reviewed here are written around taxable retail sales and, in several cases, buyer-payment collection. A pure item-for-item exchange flow with no platform-handled payment appears lower risk than a cash marketplace. That said:

- barter transactions can still create separate tax issues
- changing the product to include cash equalizers, credits, token balances, or in-app payment collection would materially change the analysis
- if TradeStash becomes a "barter exchange" under federal tax rules, information-reporting issues can arise even without standard checkout

### Virginia

Official read:

- Virginia says a marketplace facilitator facilitates the sale of a seller's products through a physical or electronic marketplace and performs functions such as payment processing, fulfillment, listing, price-setting, or customer-service support.
- Virginia also explicitly excludes a platform that exclusively advertises goods for sale and does not engage in those additional activities.
- Threshold: more than $100,000 in annual gross retail sales or 200 transactions.

Product implication:

- If TradeStash remains a no-cash swap platform and does not collect or route payment between users, facilitator risk looks lower than a normal marketplace.
- If TradeStash later introduces credits, money balancing, paid add-ons inside the same transaction flow, or seller-of-record behavior, Virginia should be re-reviewed immediately.

### Maryland

Official read:

- Maryland requires marketplace facilitators to collect tax on each facilitated retail sale or sale for use.
- Maryland's tax alert describes marketplace facilitators as entities that list or advertise for sale in a marketplace and collect payment from the buyer and transmit it to the seller.
- Threshold: more than $100,000 in Maryland revenue or 200 separate transactions.

Product implication:

- Maryland's definition is helpful for TradeStash because payment collection is a core element of the facilitator description.
- A pure barter flow is lower-risk than a standard paid marketplace, but attorney review is still needed on whether Maryland could treat some exchanges as taxable consideration events.

### District of Columbia

Official read:

- DC requires marketplace facilitators to collect District sales tax on behalf of marketplace sellers.
- DC's FAQ defines a marketplace facilitator as a person that provides a marketplace for retail sales subject to tax and directly or indirectly collects payment from a purchaser and remits it to a marketplace seller.
- DC remote sellers also face the familiar $100,000 / 200 transaction threshold, but the facilitator rule itself is framed around taxable retail sales.

Product implication:

- Of the four jurisdictions reviewed, DC gives one of the cleanest signals that no-payment barter is outside the center of the marketplace-facilitator rule.
- Risk increases if TradeStash ever handles paid delivery, in-app price balancing, or other cash settlement tied to the item transaction.

### West Virginia

Official read:

- West Virginia guidance says marketplace facilitators with economic nexus must collect and remit sales and use taxes on taxable sales they facilitate.
- Threshold: $100,000 in gross revenue or 200 transactions.
- The guidance focuses on taxable sales of tangible personal property, custom software, or services.

Product implication:

- A pure barter marketplace is lower-risk than a normal ecommerce facilitator, but West Virginia still treats taxable sales broadly.
- If TradeStash handles any part of a monetary sale, service fee, or trade-credit system, the WV analysis should be refreshed.

### Federal barter issue

Official read:

- The IRS states that bartering is taxable and that barter exchanges may have Form 1099-B reporting obligations.
- The IRS also notes that a barter exchange is an organization whose members contract to exchange property or services.

Product implication:

- This is the biggest non-state flag in the stack.
- Even if state marketplace-facilitator laws do not clearly attach, TradeStash should get attorney/CPA review on whether the platform design, terms, and any future trade-credit features could make it a reportable barter exchange.

### Attorney review checklist

- confirm whether pure item-for-item exchanges on TradeStash are outside each state's marketplace-facilitator collection regime
- confirm whether any barter transaction itself creates state sales/use tax exposure for users
- confirm federal 1099-B / barter-exchange exposure
- review delivery-fee flow before BEAM integration goes live
- review whether premium verification, boosts, or future trade credits change tax classification

## Campus Ambassador Research

### DoorDash pattern

Observed structure:

- DoorDash publicly markets a student-priced DashPass for Students offer.
- Public campus-launcher job postings describe student reps as the face of DoorDash on campus.
- The role includes 10-15 hours per week, partnerships with local businesses, and multiple tabling events each week.
- A 2025 campus news report described recurring free-food activations and a weekly event budget per ambassador.

What to copy:

- paid student reps, not unpaid "resume-only" evangelists
- repeated IRL activations, not one launch week and then silence
- merchant tie-ins that produce obvious student value immediately
- conversion target tied to signups and ongoing use, not vague brand awareness

### Lyft pattern

Observed structure:

- Lyft's higher-education strategy is institution-partnership driven, not classic ambassador marketing.
- Lyft Business markets campus transportation programs focused on safety, convenience, and cost savings.
- Public customer stories emphasize late-night ride zones, ride credits, and clear campus use cases.

What to copy:

- sell campus mobility and safety benefits to administrators and student governments
- use geo-fenced, time-bound benefits for trade meetups or launch events later
- frame transportation not as branding fluff but as operational convenience

### Cash App pattern

Observed structure:

- Cash App's youth strategy is more creator / advisory / cultural than classic campus table marketing.
- Cash App launched a Teen Advisory Council in late 2025 to build a direct youth-feedback loop.
- Cash App also uses talent and financial-literacy partnerships to reach younger audiences.

What to copy:

- recruit student creators and culture leaders, not only club officers
- build a student advisory council for product feedback and campus trend intelligence
- tie the brand to financial literacy, trust, and practical utility instead of generic swag

### Recommended TradeStash ambassador model

#### Team structure per campus

- 1 paid campus lead
- 2 to 4 micro-ambassadors by dorm / org / social cluster
- 1 creator partner for content capture and reposting

#### Weekly operating rhythm

- 2 in-person trading-table or giveaway activations
- 1 dorm or org partnership drop
- 1 leaderboard / challenge push
- 1 recap post with screenshots, trade stories, and winner callouts

#### Incentives

- fixed stipend
- signup / activation bonuses tied to completed profiles and first listings
- bonus for first completed trade per recruited user
- monthly campus-title rewards: "Legend House," "Top Dorm," "Top Ambassador"

#### Content system

- trade-of-the-week UGC
- dorm declutter challenges
- move-out / move-in swap drops
- club partnership bundles: athletes, creatives, gamers, sneaker clubs, student government

#### HBCU / PWI application

- HBCUs in the launch mix should get creator-first, community-status-heavy campaigns with visible local leadership
- larger PWIs should get dorm-density, utility, and convenience framing with heavier tabling volume
- commuter-heavy campuses should get off-campus housing and city-neighborhood trade clusters, not only on-campus booths

## Top 10 Target Campuses

Recommended priority order:

1. Howard University
   Reason: strongest cultural flagship in DC, dense student identity, HBCU advantage, excellent launch-story campus.
2. University of Maryland
   Reason: scale, off-campus housing density, College Park anchor, broad category demand.
3. Morgan State University
   Reason: Baltimore HBCU foothold, strong community identity, clean second-city narrative.
4. George Mason University
   Reason: Northern Virginia commuter + apartment network, practical-item trade potential is high.
5. Virginia Commonwealth University
   Reason: urban student mix, arts + dorm + apartment turnover, Richmond leaderboard anchor.
6. Georgetown University
   Reason: strong social signaling, affluent peer network, premium / verified adoption potential.
7. American University
   Reason: policy/international student mix, dense campus culture, strong club ecosystem.
8. The Catholic University of America
   Reason: smaller DC campus can be won quickly with focused ambassador coverage.
9. West Virginia University
   Reason: strong identity and sports culture, useful for proving TradeStash travels beyond the core DMV.
10. Shepherd University
    Reason: lower-cost foothold into West Virginia with manageable market-entry complexity.

Wave recommendation:

- Wave 1: Howard, UMD, Morgan State, George Mason, VCU
- Wave 2: Georgetown, American, Catholic, WVU, Shepherd

## Source Links

Competitors:

- Bunz FAQ: https://bunz.com/faq
- Bunz public profile example: https://bunz.com/profile/charmainey
- Listia homepage: https://www.listia.com/
- Listia overview: https://help.listia.com/hc/en-us/articles/204093798-What-is-Listia
- Listia sign-up: https://help.listia.com/hc/en-us/articles/204561937-How-do-I-sign-up-for-Listia
- Listia listing creation: https://help.listia.com/hc/en-us/articles/204155906-How-do-I-create-a-listing-auction
- Listia verification: https://help.listia.com/hc/en-us/articles/204561837-What-are-the-account-verification-levels
- Swap official site snapshot: https://swap.com/
- Swapsies: https://swapsies.us/

Legal:

- Virginia marketplace facilitator guidance: https://www.tax.virginia.gov/remote-sellers-marketplace-facilitators-economic-nexus
- Maryland marketplace facilitator tax alert (PDF): https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/alerts/SUT_Tax_Alert_Sept2019.pdf
- DC sales tax FAQs: https://otr.cfo.dc.gov/page/sales-and-use-tax-faqs
- DC sales and use tax overview: https://otr.cfo.dc.gov/am/node/1794126
- DC filing instructions referencing marketplace facilitator reporting (PDF): https://otr.cfo.dc.gov/sites/default/files/dc/sites/otr/page_content/attachments/2025%20FR800MQA%20instructions%20v1.0%20_Final_08232024.pdf
- West Virginia marketplace facilitator guidance (PDF): https://tax.wv.gov/Documents/TSD/tsd442.pdf
- West Virginia sales and use tax overview: https://tax.wv.gov/Business/SalesAndUseTax
- IRS Topic 420 on bartering: https://www.irs.gov/taxtopics/tc420
- IRS Publication 525 bartering section: https://www.irs.gov/publications/p525/ar01.html

Campus programs:

- DoorDash DashPass for Students: https://about.doordash.com/en-us/news/doordash-launches-dashpass-for-students-membership-plan
- DoorDash Campus Launcher role example: https://career.auburn.edu/jobs/doordash-doordash-college-campus-launcher/
- Secondary example of DoorDash on-campus activation budget: https://spartanmediagroup.net/8190/showcase/ambassadors-serve-up-savings/
- Lyft higher education programs: https://www.lyft.com/business/industries/higher-education
- Lyft university customer story example: https://www.lyft.com/business/customer-stories/university-of-southern-california
- Cash App Teen Advisory Council: https://cash.app/press/cash-app-launches-teen-advisory-council
- Cash App Angel Reese partnership / financial literacy campaign: https://cash.app/press/cash-app-teams-up-wnba-all-star-angel-reese

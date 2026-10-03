# Next session: the owner's changes (written 2026-10-02)

> **Done and pushed 2026-10-03.** Everything under "The work, in order" is
> built and reviewed. So is Krishna's extra request from that morning: the hero
> visuals (About's map, What we do's globe, the service pages' dial) now show on
> landscape tablets from 1024px, measured at the real iPad Safari first screens.
> The defaults below were used for every open decision.
>
> **Still open, for Krishna:**
> - Run `web/scripts/patch-home-credentials.ts -- --write`: a live Sanity
>   `setIfMissing`, needed so editors can edit the home credentials. The dry run
>   is clean (published document plus one open draft).
> - Ask the owner to confirm the three web-sourced logos: ScribeAmerica (a PNG
>   from their site), Ramsay Health Care (an SVG from ramsayhealth.com.au) and
>   JMAN Group (an SVG from jmangroup.com).
> - "40+ countries" still stands outside About: contact (2), home (Why copy, FAQ),
>   legal ("forty"), navigation (2) and the service FAQ.
> - The App Store link is the India storefront (`/in/`), as in the owner's QR.
> - The reduced-motion / no-JS fault in the shared `Reveal`, `SoftRise`,
>   `MaskReveal` and `Counter` components. Krishna's machine reports reduced
>   motion, so he may see it himself.
> - Container query units need Safari 16+ (iPadOS 15 tablets lose the asides'
>   layout).

When Krishna types **"lets go"**, do exactly the changes below, in this order, and
nothing else. Source: the owner's PDF,
`C:\Users\krish\Downloads\Hazeberg Website changes points.docx.pdf` (3 pages), whose
words are copied in full at the bottom of this file. The photos are in
`web/public/Hazeberg/` (git-ignored, 204 MB, never commit them).

Work rules that still apply: verify by measurement and report numbers (no screenshots
or browsers), US English, check `gh api user --jq .login` is `krishnamehta-probot`
before any push, commit only when asked. Use a workflow with builders, reviewers and
a progress bar, as on 2026-10-02.

---

## Decisions: defaults unless Krishna says otherwise

Asked on 2026-10-02 and not yet answered. If there's no answer when the session
starts, go with the default and say so in the report.

| # | Question | Default |
|---|---|---|
| 1 | The owner says **160+ countries**; the site says **40+** everywhere else (About story and "How we're built", the nav's Services lede, the "200+ integrations, 40+ countries" proof card, service FAQs, the delivery map) | 160+ in the About stats, and every "40+ countries" on the About page becomes 160+ so the page does not contradict itself. List the other pages' "40+" in the report for Krishna; do not change them |
| 2 | Sakthi's title: the owner wrote **"Founder & CEO"**; the About document has "CEO & Co-founder" | "Founder & CEO" in the founder note and on his Leadership card |
| 3 | "**People is everything** at Hazeberg" | "People are everything at Hazeberg." Keep HARD / HARDER / OFTEN in capitals and drop the stray space before the comma |
| 4 | ScribeAmerica, Ramsay Health and JMAN Group logos are not in the zip or the repo | Take each company's own logo from its own website, prepare it like the other twelve (`scripts/logos-light.mjs`, `scripts/inkscale.mjs`), and flag them as web-sourced for Krishna to confirm |
| 5 | About stats: keep "100% Customer retention" (from the About document) beside the owner's new figures? | Keep it if the hero rail still fits (redo the fit arithmetic), otherwise the owner's five |
| 6 | The Berg web app link | `https://berg.hazebergconsulting.com`, already the "On mobile" button's target |

---

## The work, in order

### 1. About page (`web/src/lib/about-content.ts`, `web/src/app/(site)/about/page.tsx`, `web/src/components/about/`)

**a. Stats** (`ABOUT.hero.stats`, now 200+ years / 20+ projects / 40+ countries /
100% retention). The owner's screenshot is the old About grid from before 2026-10-02,
when it still had "200+ Integrations built"; that one is already gone. New set:
200+ consolidated years of experience · 20+ Workday projects delivered ·
**160+ countries** · **35+ customers** · **5M users served** (· 100% customer retention,
per decision 5). The hero is PageHero `fit`; the rail must still fit 1280×650 →
1920×950. Prove it by arithmetic, as `page-hero.tsx` describes.

**b. Founder note.** A new section for Sakthi Vignesh, using the full text below, word for
word. The owner's bold phrases become emphasis. Photos:
- `Founder Photo.png` (1536×1024): portrait in a suit, office background.
- `Founder Recognization.jpeg` (1280×960): Sakthi with two people, white background.
- `Founder Recognization1.jpeg` (1148×1280): Sakthi receiving something from a
  dignitary in an office.

Put it after Our story or fold it into Leadership. Choose by what reads best and say
which. His Leadership card's title changes per decision 2.

**c. Life at Hazeberg.** A new section with the owner's two lines (decision 3), the
offsite photos and the recognition photos:
- `Offsite 2025/` has 4 WhatsApp images, all 1200×1600 or 1600×1200: riverside group,
  resort group, outdoor group, and a party with a "Hazeberg 1" anniversary cake.
- `Offsite 2026/` has 7: `JUN04805` (speaker with a microphone), `JUN04873` (team
  seated), `JUN04898` (speaker at a podium), `JUN04967` (group with a trophy),
  `JUN05139` (whole team indoors), `JUN05273` (whole team outdoors), and a WhatsApp
  selfie by the water.
- Recognition (trophy and medal moments):
  - `Indhu - Recognization.JPG`, `Namitha - Recognization.JPG`,
    `Rajesh - Recognization.JPG` and `Vignesh - Recognization.JPG` (trophy handovers);
  - `Recognization.JPG` (team with trophies outdoors);
  - `JUN04817.JPG` and `JUN04842.JPG` (team with medals).
- Many originals are 7008×4672 MPO, 16–29 MB. Make web copies with sharp: EXIF-rotated,
  about 2400px on the long edge, JPEG/WebP around 80 quality, a few hundred KB each.
  Put them under a new `web/public/about/` folder with plain names
  (`offsite-2025-01.jpg` …) and serve them through `next/image` with real alt text.
  The photos are real people, so the alt text describes the moment, not the faces.

### 2. Home page

Add the owner's two lines, word for word:
- "1st Workday exclusive consulting firm from a Tier-2 city from India"
- "3rd Workday exclusive consulting firm from India"

They are credentials, so place them where proof lives (the hero's trust line or Why
Hazeberg), not as list items. The home page is on Sanity (`tgjfg4q8`). If the spot is
CMS-backed, add the field with `sanity/schemaTypes/fields.ts`, seed it, and keep the
code fallback (`lib/home/fallback.ts`) identical.

### 3. Berg page (`web/src/lib/berg-content.ts` `app`, the "On mobile" card)

Add QR codes for Android and iOS plus the web app link (decision 6). The owner's PNGs
are only about 200px (`BERG - Android QR Code.png`, `BERG - iOS QR Code.png`), so redraw
them as crisp vector QR codes from the URLs they decode to:
- Android: `https://play.google.com/store/apps/details?id=com.shrewd.berg&pcampaignid=web_share`
- iOS: `https://apps.apple.com/in/app/berg-hazeberg/id6756188557`

On a phone, a QR code is useless, so show tappable store buttons there instead.

### 4. Clients (`web/src/lib/home-content.ts` `LOGOS`; the label is in Sanity)

- **Direct clients:** Enovix, Hitachi, ScribeAmerica, Ramsay Health, JMAN Group.
- **Everyone else** gets a "Via Partners" label.

Enovix and Hitachi are already in the strip, and the other three need logos
(decision 4). The strip is a rolling marquee, so group the direct five first and set
"Via partners" over the rest. Don't put a label in the middle of a moving row.

---

## Not tomorrow's scope (open, waiting on Krishna)

- **Reduced-motion fade-in fix** in `reveal.tsx` / `mask-reveal.tsx` / ScrollText.
  Content can stay invisible for reduced-motion users. Needs his yes.
- **Pause button for the HCM Industries and Extend card grids.** Keyboard users can't
  stop them (WCAG 2.2.2). Needs his yes.
- **The second Workday Integrations document**
  (`1TFWmY8R59OsfUeZ4a-jf81B4iIsdrhYsXKLiHP4jUY0`) is private and returns 401. It needs
  "anyone with the link can view".
- **Reporting & Analytics** is held back (`published: false` in
  `web/src/lib/home/services.ts`) until its document arrives.
- **Other open items:** the Coimbatore address conflict, and the Support route on module
  pages pointing at What we do rather than the AMS page. The contact form's interest
  list has no HCM, Payroll, Financials or Extend.

---

## The owner's words, verbatim (PDF, 2026-10-02)

**BERG Page:** QR Codes to be added for Android and iOS for Mobile application download.
Web application link can be added too. BERG QR codes attached.

**Home Page:** Add these lines
- 1st Workday exclusive consulting firm from a Tier-2 city from India
- 3rd Workday exclusive consulting firm from India

**About Page:** (screenshot of the old grid: 200+ Consolidated years of consultant
experience · 20+ Workday projects delivered · 200+ Integrations built · 40+ Countries
supported)
- Remove: 200+ Integration built
- Add: 160+ Countries · 35+ customers · 5M users served

**Founder note:**

> **Sakthi Vignesh**
> **Founder & CEO, Hazeberg Consulting LLP**
>
> **Building a Workday consulting company from Coimbatore, with a global vision.**
>
> Sakthi Vignesh is the Founder and CEO of **Hazeberg Consulting LLP**, a Workday-focused consulting firm built with a simple belief: **quality should always come before quantity.**
>
> With deep experience in the Workday ecosystem, Sakthi founded Hazeberg with the ambition of creating a consulting organization that combines strong technical expertise, trusted customer relationships, and a culture where people can grow. What started as a focused entrepreneurial venture has grown into a global Workday consulting team supporting customers across multiple Workday programs and geographies.
>
> Under his leadership, Hazeberg has developed expertise across **Workday HCM, Finance, Integrations, PRISM, Adaptive Planning, Payroll, Reporting, Workday Extend, Orchestrate, Studio, and post-production support**. The company works with organizations ranging from growing businesses to global enterprises, including Fortune 100 and Fortune 500 organizations.
>
> Sakthi's approach to building Hazeberg is rooted in three principles: **stay specialized, stay close to customers, and continuously invest in people.** He believes that a consulting company's greatest strength is not its size, but the quality of its people and the trust it builds with every engagement.
>
> He is also the driving force behind **BERG**, a platform created specifically for the Workday ecosystem, bringing together Workday customers, consulting firms, and professionals on a unified platform.
>
> **Beyond Business:**
>
> **For Sakthi, entrepreneurship is not simply about building a company. It is about creating opportunities, developing talent, and building something that can create a lasting impact.**
>
> He believes great companies are built by people who work hard, work smart, work together, and celebrate their journey along the way.
>
> From building a Workday practice in Coimbatore to creating a global consulting organization, Sakthi continues to focus on one goal — building Hazeberg into a trusted name in the Workday ecosystem, one customer and one consultant at a time.

**Life at Hazeberg:**
- Please add – Offsite photos 2025 and 2026
- Add these lines - People is everything at Hazeberg. Hazeberg values the team as much
  as they value customers.
- We work HARD, we party HARDER , we party OFTEN
- Please add - Recognition photos

**Client:** Enovix, Hitachi, ScribeAmerica, Ramsay Health, JMAN Group.
Rest – Add "Via Partners" and add logos.

# The 60-Second Property Match

**Interactive touchscreen / kiosk prototype** · Next.js 15 + TypeScript + React 19 + Framer Motion + CSS · Based on the supplied 23-page PRD v1.0, 3 November 2026.

A premium, cinematic, 16:9 landscape web experience designed for Sinar Mas Land marketing booths. **Prototype, not an officially endorsed Sinar Mas Land site.**

## Run locally

Requires **Node.js 20.9+** and network access for npm package installation.

```bash
npm install
cp .env.example .env.local         # Windows: copy .env.example .env.local
npm run dev
```

Open **http://localhost:3000**. For a kiosk, maximize the browser and use fullscreen (`F11`). A 1920×1080 landscape display is recommended; the layout adapts to smaller screens.

### Experience

| Screen | Interaction |
|---|---|
| 00 Welcome | Cinematic hero and start CTA |
| Q1 Main lifestyle | 6 visual single-choice cards |
| Q2 Daily destinations | 9 multi-select categories; minimum 1 / maximum 3 |
| Q3 Priorities | Pointer drag-to-zone AND tap-to-sort fallback; max 2 MUST HAVE; all 5 required |
| Q4 Weekend | Scrollable/swipeable image carousel with arrow navigation |
| Q5 Travel comfort | 5-step slider with tap-to-select stops |
| Q6 Environment | 4-option image stack; tap select and horizontal swipe |
| Lead gate | Name, WhatsApp, optional email, purchase timeline, optional budget and consent |
| Results | Rule-based lifestyle profile and up to 3 properties, %-matching demo |
| Details | Property details, score rationale, interest CTA, official project links |
| Security UX | Reset with 20-second warning after 100 seconds idle; entire state cleared at 120 seconds |

In **demo mode**, the whole walkthrough is usable and no personal information is sent to a server or persisted. Enter **sample**, not real, contact data. All matching percentages are explicitly **illustrative** because property criterion scores and inventory availability have not been verified. Project summaries and indicative pricing are from public sources and must be refreshed before use.

## Enabling PostgreSQL lead persistence

1. Create a private PostgreSQL database (Neon, Supabase or standard PostgreSQL).
2. Run `database/schema.sql` in that database using its SQL editor or psql.
3. Set in `.env.local`:

```dotenv
NEXT_PUBLIC_DEMO_MODE=false
DATABASE_URL=postgresql://USER:PASSWORD@YOUR_HOST/YOUR_DATABASE?sslmode=require
```

4. Restart the Next.js server. The `POST /api/leads` route validates data, calculates matching, and inserts the lead, all answers, the profile, and the score breakdown into PostgreSQL **before** it returns a successful result. A failed write keeps the visitor on the form with a retry message. `POST /api/events` logs explored/selected/contact-sales events and updates selected interest.
5. Confirm consent language, create/link a production privacy notice, set a retention/deletion policy and access restrictions, and verify database connectivity from the deployment environment.

**Important:** The repository's sample catalog has **synthetic/unverified** criterion scores and no verified stock availability. Enabling the database does **not** make recommendations suitable for use as factual consumer advice. Replace `src/lib/data.ts` with an official, approved inventory feed; validate eligibility, availability, real prices, travel-time sources and criteria scores as described in PRD §6.4–6.5 **before public deployment**. This demo does not provide a production CMS, authentication, CRM integration, verified route calculations, or enterprise-grade operational monitoring. They remain subsequent development phases.

## Architecture

```text
src/
  app/
    page.tsx              Complete touchscreen flow (client)
    globals.css           Custom responsive premium visual system
    layout.tsx            Metadata and font/layout base
    api/
      leads/route.ts      Server-side lead validation and PostgreSQL write
      events/route.ts     Interest and conversion event logging
      health/route.ts     Safe health status endpoint
  lib/
    data.ts               Screens' options, official image URLs, synthetic demonstration catalog
    matching.ts           Deterministic profile and weighted matching engine
 database/
   schema.sql             PostgreSQL tables and indexes
```

### Scoring (PRD §6)

- Default weights: workplace 25%, education 20%, lifestyle destinations 20%, environment 20%, connectivity 15%.
- Q1 and Q6 emphasize selected dimensions; Q2 influences category weights; Q3 applies multipliers MUST=1.5, NICE=1.0, NOT=0.5.
- Q4 influences the environment/lifestyle emphasis; Q5 “distance not important” reduces distance-oriented influence.
- Weights are normalized to sum to 100%. Budget ceilings are applied before ranking.
- Display position: **Best Match**, **Alternative Match** (different segment), **Lifestyle Upgrade** (upgrade-flagged property meeting criteria); missing slots show the remaining eligible options or an advisor-assist message.
- Individual scores, ranking and explanations in this repository are generated deterministically but from **demo example numbers**. Do not present as verified property measurements.
- The true engine will additionally need data completeness threshold, official per-project availability, verified per-criterion sources and travel-time data.

## Photos / branding

The interface references **remotely hosted** images from public Sinar Mas Land and related Sinar Mas Land real-estate channels. The remote sources are in `src/lib/data.ts`. An image will need internet access at kiosk runtime; fallback color treatment is shown if images cannot load. Download/license and serve locally with permission for production kiosk stability. The Sinar Mas Land logo is referenced from its parent corporate page; replace with the official brand file supplied by the brand team for launch. This is an independent UI concept.

Selected public sources used to ground the catalog:

- [Sinar Mas Land – BSD City](https://www.sinarmasland.com/development/township/bsd-city)
- [Vyorelle at Vireya](https://www.sinarmasland.com/development/residential/vyorelle-at-vireya)
- [Castilo at Terravia](https://www.sinarmasland.com/development/residential/castilo-at-terravia)
- [Monard of The Armont](https://events.sinarmasland.com/development/residential/monard-of-the-armont/)
- [Wynyard at Hiera – eCatalog](https://ecatalog.sinarmasland.com/project/hiera/cluster/wynyard)
- [Sinar Mas Land – NavaPark image](https://www.sinarmasland.com/news/sinar-mas-land-kembali-raih-penghargaan-di-asia-pacific-property-awards)

**Public content is not a license to use photos in a commercial booth.** Confirm marketing asset rights with Sinar Mas Land.

## Key deployment checklist

- Serve via HTTPS. Set a kiosk browser in fullscreen mode and prevent accidental OS navigation.
- Set computer sleep/lock appropriately and restrict access to browser settings.
- Point kiosk network to a reliable, monitored connection; cache or locally host all approved image assets.
- Obtain legal approval for consent/privacy policy text and review the linked official Sinar Mas Land Privacy Policy with legal (confirm it applies to this kiosk data collection, purposes and controller).
- Add stronger API abuse prevention, auth to any administrative views, privacy deletion workflows, verified inventory service and audit logging before accepting live visitors.
- Test with a physical touchscreen (drag, 10-point touch, keyboard overlay, long-press, stale session behavior).

## Build check

```bash
npm run typecheck
npm run build
```

**Note:** Dependencies were not installed in the file-generating environment due to an unavailable npm registry; please run the commands above after download. The project source has been statically checked for parsing issues, but a full Next.js production build must be verified in your development environment.

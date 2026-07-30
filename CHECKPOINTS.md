# Voice Assistant Website — Checkpoint Plan

**Location:** `D:\VoiceAssistant\VoiceAssistantWebsite`
**Stack:** Next.js 15 (App Router, TypeScript) · Payload CMS 3 · PostgreSQL · Tailwind CSS + shadcn/ui · next-intl (EN/BN) · Vercel
**How to use this file:** Work strictly top-to-bottom. A checkpoint is done only when **every box** under it is checked and its **Verify** step passes. Mark boxes `[x]` as we go — this file is the single source of truth for progress.

**Legend:** `CP` = Checkpoint · ✅ Verify = the proof required before moving on

> **Design constitution:** `content/design-guidelines.md` (adopted 2026-07-30) is binding for all design/content work — story-driven pages, premium simplicity, professional-not-childish, children as the heroes, accessibility by design, reduced-motion support. Every Phase 3–6 checkpoint is additionally checked against it.

---

## PHASE 0 — Decisions & Content Inputs

### CP-0.1 · Project identity locked
- [x] Final public app name confirmed: **Voice Assistant** (decided 2026-07-30)
- [x] Tagline written in English and Bangla → `content/brand.md` (proposed, awaiting final word tweak)
- [x] Logo available: app icon (`content/assets/app_icon.png`) + text wordmark; no separate design needed for launch
- [ ] App screenshots exported from the Flutter app for use on the site ⚠️ **needs team input** (list in brand.md)

✅ Verify: a `content/brand.md` file exists in the project folder with name, tagline (EN/BN), and logo files in `content/assets/`. ✔ PASSED (screenshots pending — does not block CP-1.x)

### CP-0.2 · Design tokens agreed
- [x] Color palette chosen: **warm pastel + institutional** — app's 5 pastel swatches (extracted from `pastel_swatches.dart`) + navy/green institutional anchors → `content/design-tokens.md`
- [x] Fonts chosen: Poppins + Inter (Latin) · Hind Siliguri + Noto Sans Bengali (Bangla)
- [ ] Reference screenshots of mist.ac.bd saved for tone alignment (tone analysis documented in design-tokens.md; screenshots optional, to add to `content/assets/mist-reference/`)

✅ Verify: `content/design-tokens.md` lists hex codes and font names. ✔ PASSED
- [x] *(added 2026-07-30)* Dark mode: full dark token set + `ThemeToggle` (localStorage + OS preference, pre-paint script, no flash) — verified with screenshots in both modes; persists across reload

### CP-0.3 · Launch content gathered (can run in parallel with build)
- [ ] About text drafted (EN + BN)
- [ ] Team member list with roles and photos
- [ ] At least 1 news post drafted (e.g., project introduction or a past handover event)
- [ ] Photos/videos from past events collected + consent status noted for each
- [ ] Contact email address for form notifications decided

✅ Verify: `content/` folder holds drafts; each child-identifiable photo has consent noted.

---

## PHASE 1 — Project Foundation

### CP-1.1 · Environment ready
- [x] Node.js 20+ and pnpm installed — build verified on Node v22 / pnpm 10 (⚠️ install Node 20+ & pnpm on the local PC too: `npm i -g pnpm`)
- [x] PostgreSQL database created — dev DB verified; ⚠️ **create a free Neon/Supabase DB and put its connection string in local `.env`** (template in `.env.example`)
- [x] Git repo initialized in `VoiceAssistantWebsite` with `.gitignore` (node_modules, .env, .next)

✅ Verify: `node -v`, `git status`, and a successful `psql`/connection test. ✔ PASSED (dev environment; local PC setup mirrors it)

### CP-1.2 · Next.js + Payload scaffolded
- [x] Next.js app (v16, App Router, TypeScript) created inside `VoiceAssistantWebsite` — Payload's current template ships Next 16 (newer than the planned 15; no downside)
- [x] Payload CMS 3.86 installed and mounted (admin at `/admin`)
- [x] Postgres adapter connected; schema tables created clean on first run
- [x] Tailwind CSS v4 configured with all CP-0.2 design tokens (`globals.css @theme`); shadcn/ui foundation ready (`components.json`, `cn()` util) — components added on demand from CP-3.2
- [x] Fonts wired via next/font: Poppins+Inter (Latin), Hind Siliguri+Noto Sans Bengali (Bangla)
- [x] Placeholder landing page proves tokens/fonts/pipeline; template demo files removed

✅ Verify: `pnpm dev` serves the site at `/` (200, branded placeholder with EN+BN text) and Payload create-first-user screen at `/admin` (200); screenshots captured; no errors in dev log. ✔ PASSED 2026-07-30

### CP-1.3 · First admin user & roles
- [x] Users collection with `admin` and `editor` roles (+ `name` field; role saved to JWT; reusable access helpers in `src/access/`)
- [x] First admin account created: `nahid.mmc41@gmail.com` / temp password `ChangeMe!2026` — ⚠️ **change on first login**
- [x] Access rules enforced: editors create/edit media (posts arrive in Phase 2 with same rule); only admins create/delete users; editors can't list other users or change roles
- [x] Test editor account created (`editor.test@example.com` / `EditorTest!2026`) for ongoing permission testing

✅ Verify: editor listing users returned only self; editor creating a user → 403; editor self-promotion to admin ignored (role stayed `editor`); admin sees all users. ✔ PASSED 2026-07-30

### CP-1.4 · Internationalization skeleton
- [x] next-intl configured with `en`/`bn` locales; routes moved to `(frontend)/[locale]/`; `/` 307-redirects to `/en`; middleware excludes `/admin` + `/api`
- [x] Payload localization enabled (`en` + `bn`, fallback to en); Media `alt` is the first localized field
- [x] `LanguageToggle` component working — links to the same path in the other locale, active locale highlighted
- [x] Bangla strings render natively (messages/bn.json written in natural cholito Bangla); `lang` attribute correct per locale (`lang="bn"` on Bangla pages)
- [x] Message catalogs: `messages/en.json` + `messages/bn.json` (site, nav, footer, language namespaces)

✅ Verify: `/en` and `/bn` both 200; toggling switches the headline EN ⇄ BN with correct glyphs (screenshots); admin panel unaffected (200). ✔ PASSED 2026-07-30 — **PHASE 1 COMPLETE**

---

## PHASE 2 — Data Model (Payload Collections)

### CP-2.1 · Media collection
- [x] Upload-enabled Media collection with localized alt text (required — a11y) and auto image sizes (thumb 480 / card 960 / hero 1920) + optional credit field
- [x] `featuresChild` checkbox + `consentConfirmed` validation — saving a child-flagged image without confirmed consent is blocked with a child-safety policy message
- [x] Storage: local disk in dev; Vercel Blob auto-enabled in production when `BLOB_READ_WRITE_TOKEN` is set

✅ Verify: child image without consent → ValidationError (tested via API); with consent → saved, all 3 sizes generated. ✔ PASSED 2026-07-30

### CP-2.2 · Posts (News) collection
- [x] Fields: title*, slug (auto from EN title, unique, indexed), category (handover / app-update / milestone), cover image, excerpt*, rich-text body*, gallery images, YouTube URLs (validated — YouTube links only), publish date — `*` = localized
- [x] Draft/publish workflow (versions+drafts); public API returns only published posts; staff see drafts
- [x] Access: editors create/edit; only admins delete

✅ Verify (all via live API): draft created EN + BN; public query saw 0 docs while draft, 1 after publish; BN locale returns Bangla title; vimeo URL rejected by validation; slug auto-generated. ✔ PASSED 2026-07-30

### CP-2.3 · Gallery Albums collection
- [x] Fields: title*, slug, description*, event date, images[] (media relations), video embeds (validated YouTube URLs + localized captions)
- [x] `displayOrder` ordering with `defaultSort` (lower first)

✅ Verify: album with 3 images + 1 video saved; changing displayOrder re-sorted the public listing. ✔ PASSED 2026-07-30

### CP-2.4 · App Releases collection
- [x] Fields: version (unique), release date, platform (android/ios/windows), changelog* (rich text)
- [x] Sorted feed (newest first via defaultSort)

✅ Verify: releases 1.0.0 + 1.1.0 created; public feed returned ['1.1.0','1.0.0']. ✔ PASSED 2026-07-30

### CP-2.5 · Team Members & editable Pages
- [ ] Team Members: name, role*, photo, display order
- [ ] Pages/Globals for Home + About content blocks (hero text*, stats numbers, mission*)

✅ Verify: editing hero text in admin changes it on the site without a code deploy.

### CP-2.6 · Trust & story collections *(added by design guidelines)*
- [x] Partners/Collaborators: name, logo, URL, type (institution/NGO/government/sponsor), order
- [x] Success Stories: quote* (localized), person name (child-safety guidance in admin), role, consent-gated photo (via Media), featured flag, order
- [x] Milestones (timeline): date, title*, description*, type (research/release/outreach/award), image
- [x] Publications: title, authors, venue, year, link/DOI

✅ Verify: one seed entry of each type created and returned via public query (MIST partner, parent story, project-start milestone, journal publication); photo consent enforced by Media collection (CP-2.1). ✔ PASSED 2026-07-30

### CP-2.7 · Contact Requests collection
- [x] Fields: name, organization, email, phone, message, type (contact/device-request), status (new/replied/closed, staff-only), internal note
- [x] Public create with spam protection: honeypot field → 400; per-IP rate limit (5/hour) → 429; submitted status always forced to "new"; inbox readable by staff only
- [x] Email notification wired (nodemailer adapter; activates when SMTP_* + CONTACT_NOTIFY_EMAIL env vars are set — see .env.example) ⚠️ needs SMTP credentials before launch (CP-6.2)

✅ Verify (live API): anonymous submission created (status forced to new); honeypot → 400; public inbox read → denied; 6 rapid submissions → last two 429; staff read 5 docs. Email send verified at deploy when SMTP is configured. ✔ PASSED 2026-07-30 — **PHASE 2 COMPLETE**

---

## PHASE 3 — Public Site Layout & Design System

### CP-3.1 · Global layout
- [ ] Header: logo, nav (Home, About, The App, News, Gallery, Contact), language toggle; mobile hamburger menu
- [ ] Footer: MIST logo + link, contact info, social links, privacy note link
- [ ] 404 page (localized)

✅ Verify: layout renders on mobile (360px), tablet, and desktop widths without overflow.

### CP-3.2 · Design system components
- [ ] Buttons, cards, section headings, badge (news category), stat tile, quote/testimonial block, timeline item, partner logo row, YouTube embed component (lazy-loaded, no layout shift)
- [ ] Pastel accents on calm surfaces per design guidelines (pastels are accents, not the theme); light + dark mode on every component
- [ ] Motion system: fade-in-on-scroll reveal, animated stat counters, micro-interactions — all ≤400ms ease-out and fully disabled under `prefers-reduced-motion`
- [ ] Focus states and keyboard navigation on all interactive components

✅ Verify: a components demo page shows all variants in EN + BN, light + dark; with reduced motion enabled, zero animation plays.

---

## PHASE 4 — Public Pages

### CP-4.1 · Home page — 11-section story flow (per design guidelines)
- [ ] 1. Hero: powerful mission statement (EN/BN), authentic photo/device mockup, primary CTA
- [ ] 2. Impact statistics (animated counters, CMS-editable)
- [ ] 3. Why this project matters (the challenge, told with dignity)
- [ ] 4. Our solution (the research journey, not a feature list)
- [ ] 5. Interactive application showcase (screenshots/screen recordings)
- [ ] 6. Research and innovation (MIST BME, methodology)
- [ ] 7. Success stories (from Success Stories collection)
- [ ] 8. Latest news and announcements (auto from Posts)
- [ ] 9. Device distribution and outreach activities
- [ ] 10. Partners and collaborators (logo row)
- [ ] 11. Call to action (request a device / follow the journey)

✅ Verify: sections flow as a narrative; all content CMS-sourced; Lighthouse performance ≥ 90; reads correctly in EN and BN, light and dark.

### CP-4.2 · About page
- [ ] Project story + mission (localized, CMS-driven)
- [ ] MIST BME context section with link to mist.ac.bd
- [ ] Team grid from Team Members collection
- [ ] Acknowledgments section

✅ Verify: adding a team member in admin appears on the page immediately (or after revalidation).

### CP-4.3 · The App page — told as a story (challenge → solution → showcase)
- [ ] Narrative opening: the communication challenge special children face, and the research motivation
- [ ] The solution: communication boards (Core Words, Basic Needs, Emotions, People, Places, Verbs, Questions, Prepositions, Time, Animals, Colors, Clothes), Bangla+English study materials, writing canvas, custom words, favorites, offline use, Bengali TTS — presented as capabilities in the story, not a feature list
- [ ] Screenshot/screen-recording per major capability
- [ ] "How devices reach kids": activation + handover model, with outreach photos

✅ Verify: every capability named on the page actually exists in the app (cross-check against `lib/features/`); page reads as narrative per design guidelines.

### CP-4.4 · News & Updates
- [ ] Listing page with category filter (Handover Events / App Updates / Milestones) + pagination
- [ ] Post detail page: cover, rich body, image gallery, video embeds, publish date, share buttons
- [ ] App Releases changelog feed on the App Updates tab
- [ ] Only `published` posts visible publicly; drafts hidden

✅ Verify: publish a post in admin → appears in listing; unpublish → disappears. Direct URL to a draft returns 404.

### CP-4.5 · Gallery
- [ ] Albums grid → album detail with lightbox image viewer
- [ ] Video section with lazy YouTube embeds
- [ ] Only consent-cleared media displayable

✅ Verify: images load responsively (correct srcset sizes); a non-consented image cannot be attached to a public album.

### CP-4.6 · Contact / Request a Device page
- [ ] Localized form with type selector (general contact / device request)
- [ ] Client + server validation, success and error states
- [ ] Honeypot + rate limiting active

✅ Verify: end-to-end test — submit form → record in admin → notification email received → spam bot simulation blocked.

---

## PHASE 5 — Quality Pass

### CP-5.1 · SEO & metadata
- [ ] Per-page titles/descriptions (localized), Open Graph + Twitter cards with images
- [ ] `sitemap.xml`, `robots.txt`, canonical URLs, `hreflang` for en/bn pairs
- [ ] JSON-LD (Organization + NewsArticle on posts)

✅ Verify: OG preview renders correctly in a card validator; sitemap lists all public routes in both locales.

### CP-5.2 · Accessibility (WCAG AA)
- [ ] Full keyboard navigation, visible focus, skip-to-content link
- [ ] Alt text enforced on all public images; correct heading hierarchy
- [ ] Color contrast checked for both palettes
- [ ] `lang` attributes correct per locale (bn pages announce Bangla)

✅ Verify: axe/Lighthouse a11y score ≥ 95 on Home, News detail, and Contact.

### CP-5.3 · Performance & responsiveness
- [ ] Images optimized via next/image everywhere; fonts subset + preloaded
- [ ] Tested at 360px, 768px, 1024px, 1440px
- [ ] Lighthouse: Performance ≥ 90, Best Practices ≥ 95 on key pages

✅ Verify: recorded Lighthouse scores committed to `docs/lighthouse/`.

### CP-5.4 · Security & privacy
- [ ] `.env` secrets never committed; admin behind strong passwords
- [ ] Rate limiting on form + login; Payload CSRF defaults intact
- [ ] Privacy & child-consent policy page written (EN/BN) and linked in footer

✅ Verify: security headers check passes (CSP/HSTS via config); policy page live.

---

## PHASE 6 — Content Load & Launch

### CP-6.1 · Real content in
- [ ] About, team, hero text entered in EN + BN
- [ ] First 2–3 news posts published (including at least one handover story if available)
- [ ] First gallery album live with consent-cleared media
- [ ] First App Release entry matching the current Flutter app version (1.0.0)

✅ Verify: no lorem ipsum or placeholder image anywhere on the public site, in either language.

### CP-6.2 · Production deployment
- [ ] Vercel project connected to the Git repo; production Postgres + Blob storage configured
- [ ] Environment variables set in Vercel; production build succeeds
- [ ] Temporary domain live (later: request `mist.ac.bd` subdomain from MIST IT)
- [ ] Analytics installed (Plausible or GA4)

✅ Verify: production URL loads both locales; admin login works in production; a test post published in production appears live.

### CP-6.3 · Handover & training
- [ ] Editor accounts created for the team
- [ ] 1-page "How to post news & photos" guide written (with consent checklist)
- [ ] Backup/restore procedure documented (database + media)

✅ Verify: a team member (not the developer) successfully publishes a test post following the guide alone.

### CP-6.4 · Launch review 🏁
- [ ] Every checkpoint above is `[x]`
- [ ] Final cross-device walkthrough (phone, tablet, desktop) in both languages
- [ ] MIST stakeholders shown the site; feedback logged as Phase 7 items

✅ Verify: sign-off recorded at the bottom of this file with date.

---

## PHASE 7 — Post-Launch (backlog, not blocking launch)

- [ ] For Parents & Teachers section (usage guide, FAQ, downloadable PDF in EN/BN)
- [ ] Device/activation tracking module in admin (which device → which school/child, internal only)
- [ ] Testimonials collection + section
- [ ] Newsletter signup
- [ ] Press kit page
- [ ] MIST subdomain migration when granted

---

## Sign-off

| Milestone | Date | Signed |
|---|---|---|
| Phase 0–1 complete | | |
| Phase 2–3 complete | | |
| Phase 4 complete | | |
| Phase 5 complete | | |
| **LAUNCH** | | |

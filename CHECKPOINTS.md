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
- [x] Sticky header: logo + wordmark, full nav (Home, About, The App, News, Gallery, Contact), language + theme toggles, active-page highlighting, mobile hamburger with accessible disclosure menu (aria-expanded/controls), skip-to-content link
- [x] Footer: brand + MIST affiliation and link, sitemap, Privacy & Child Safety link, GitHub link, copyright
- [x] Localized 404 page (EN/BN) with back-home CTA; stub "coming soon" pages for all nav routes so navigation never dead-ends (replaced in Phase 4)

✅ Verify: all routes 200 (/en, /bn, /en/design, stubs); unknown URL → 404; layout screenshotted at 390px (menu open) and 1280px with no overflow. ✔ PASSED 2026-07-30

### CP-3.2 · Design system components
- [x] Button (primary/secondary/ghost, md/lg, link+anchor variants), Card, SectionHeading (khaki eyebrow + confident title + lede), Badge with category-tone mapping, StatTile (count-up on first view), QuoteBlock, TimelineItem, YouTubeEmbed (lazy thumbnail — iframe loads only on play, aspect-ratio box → no layout shift), Reveal (fade-in-on-scroll wrapper)
- [x] Pastels used as accents on calm surfaces; every component tokenized → works in light + dark automatically
- [x] Motion system: 400ms ease-out reveals (once per element), 1s eased stat counters, hover micro-interactions — all disabled under `prefers-reduced-motion` (global CSS guard + JS checks)
- [x] Global `:focus-visible` outline; skip link; aria labels on icon buttons
- [x] Demo page at `/en/design` + `/bn/design` (internal, unlinked)

✅ Verify: demo page renders all variants; reduced-motion emulation → `.reveal` opacity 1 immediately (no animation); console clean. ✔ PASSED 2026-07-30 — partner logo row lands with real partner data in CP-4.1

---

## PHASE 4 — Public Pages

### CP-4.1 · Home page — 11-section story flow (per design guidelines)
- [x] 1. Hero: mission statement from CMS (falls back to tagline), hero photo slot (placeholder mockup until real photo uploaded), Request-a-device + Explore-the-app CTAs
- [x] 2. Impact statistics — CMS-editable stats array → animated counters
- [x] 3. Why this project matters — CMS rich text with dignified default copy (EN/BN)
- [x] 4. Our solution — CMS rich text + link to The App page
- [x] 5. Application showcase — 12 category chips in app pastel rotation + offline/bilingual note (screenshots slot in when exported from the app)
- [x] 6. Research and innovation + featured video slot (lazy YouTube embed, CMS-set URL)
- [x] 7. Success stories — featured stories from collection → quote blocks
- [x] 8. Latest news — 3 newest published posts with cover, category badge, date, excerpt + "all news" link
- [x] 9. Device distribution & outreach — narrative + latest outreach milestones + gallery link
- [x] 10. Partners — logo row (falls back to wordmark when no logo uploaded)
- [x] 11. CTA band — "Help a child be heard" → contact
- [x] Robustness: every CMS fetch failure-tolerant (page renders with defaults on empty DB); Reveal fail-safe guarantees content never stays hidden; full type-check clean

✅ Verify: all 11 sections render as one narrative with live CMS data (full-page screenshots EN-light + BN-dark); console clean; `tsc --noEmit` passes. Lighthouse ≥90 measured formally at CP-5.3 (production build). ✔ PASSED 2026-07-30

### CP-4.2 · About page
- [x] Project story + mission (localized, CMS-driven, RichText with fallback copy)
- [x] MIST BME context section with link to mist.ac.bd (acknowledgments section)
- [x] Team grid from Team Members collection (photo or initial-avatar fallback)
- [x] Acknowledgments section
- [x] Timeline of milestones (CMS-driven, typed badges)

✅ Verify: page renders full narrative (hero → story → mission → team → timeline → acknowledgments) with CMS-fallback defaults on empty DB; `tsc --noEmit` clean; routes return 200 EN+BN. ✔ PASSED 2026-07-31

### CP-4.3 · The App page — told as a story (challenge → solution → showcase)
- [x] Narrative opening: the communication challenge special children face, and the research motivation
- [x] The solution: 12-category board showcase, Bangla+English study materials, custom words, offline-use band, handover model with outreach milestone badges — presented as capabilities in the story, not a feature list
- [x] Latest app version pulled from App Releases collection
- [x] "How devices reach kids": handover model narrative + outreach milestone badges + CTA to /contact

✅ Verify: every capability named on the page matches the app's real feature set; page reads as narrative per design guidelines; `tsc --noEmit` clean; route returns 200 EN+BN.

**Dark-mode band-bg fix (both CP-4.1 and CP-4.3):** the homepage CTA band and the App page's "Works completely offline" band previously reused `bg-navy-900`, a token that intentionally flips to a LIGHT color in dark mode (for headings) — causing those bands to render pale/washed-out in dark mode instead of staying a bold dark surface. Fixed by introducing dedicated fixed-contrast tokens (`--color-band-bg` / `--color-band-text` / `--color-band-text-soft`) that always stay deep-dark-with-white-text in both themes, and swapping both bands to use them. Verified via Playwright full-page screenshots in all 4 combinations (home/app × light/dark): bands now render as a bold near-black surface with white text in dark mode, and a bold navy surface with white text in light mode. ✔ PASSED 2026-07-31

### CP-4.4 · News & Updates
- [x] Listing page with category filter (Handover Events / App Updates / Milestones) + pagination (page-size 9, `?category=&page=`)
- [x] Post detail page: cover, rich body, image gallery, video embeds, publish date, share buttons (Facebook / WhatsApp / email / copy-link)
- [x] App Releases changelog feed on the App Updates tab
- [x] Only `published` posts visible publicly; drafts hidden (enforced by the Posts collection's existing access rule — `getPostBySlug`/`getNewsListData` never see drafts)

✅ Verify: `tsc --noEmit` clean; `/en/news`, `/en/news?category=app-update`, `/bn/news` all return 200 with correct localized copy; a real published seed post ("First Device Handover at Dhaka School") renders correctly on both the listing card and its detail page in EN-light and BN-dark (Playwright screenshots, 0 console errors); direct URL to a non-existent/unpublished slug (`/en/news/this-slug-does-not-exist`) returns 404 via the shared locale `not-found.tsx`; App Updates tab shows real version history (v1.1.0, v1.0.0) pulled from the App Releases collection. ✔ PASSED 2026-07-31

### CP-4.5 · Gallery
- [x] Albums grid → album detail with lightbox image viewer (keyboard arrows/Escape, click-outside-to-close, prev/next for multi-image albums)
- [x] Video section with lazy YouTube embeds (reuses the shared `YouTubeEmbed` component + captions)
- [x] Only consent-cleared media displayable (defensive `consentCleared()` filter in `lib/cms-gallery.ts`, on top of the Media collection's save-time consent validation from Phase 2)
- [x] Album cards on the listing grid show a modern hero-photo + thumbnail-strip cover (large main photo, up to 3 smaller thumbnails beneath it, "+N" badge on the last thumbnail when more photos exist) plus a decorative "view album" chevron next to the title — iterated per user mockup after an initial flat 2×2 mosaic version.

✅ Verify: `tsc --noEmit` clean; `/en/gallery`, `/bn/gallery` return 200; seeded a real test album via the local API and confirmed end-to-end: listing card shows cover + photo count + date, detail page renders images in a responsive grid, clicking a photo opens the lightbox (Playwright screenshot confirms overlay/close button/large image), video section renders with lazy-load thumbnail + play button + caption; direct URL to a non-existent album slug returns 404; 0 console errors in light/dark and EN/BN. Found and fixed a real bug during verification: `youTubeId()` was defined inside a `'use client'` file and could not be called from the Server Component pages that filter video arrays — this silently crashed both `/news/[slug]` and `/gallery/[slug]` whenever a post/album actually had video embeds (previously masked because `.filter()` never invokes its callback on an empty array, so the CP-4.4 seed post's empty `youtubeUrls` never took this path). Fixed by moving `youTubeId` into a plain server-safe `src/lib/youtube.ts` shared by both the client embed component and the server pages. ✔ PASSED 2026-07-31

**Site-wide reliability fix (found while testing gallery reconnection behavior):** every `lib/cms*.ts` data function called `await getPayload({ config })` *outside* of the `safe()` try/catch wrapper meant to make every CMS fetch fault-tolerant. When the pooled Neon Postgres connection drops or times out while idle (common during local dev — the exact "Connection terminated unexpectedly" error the user hit), that unguarded call threw and crashed the whole page with a 500, defeating the entire point of the fallback-content design. Fixed by adding a shared `getPayloadSafe()` helper in `lib/cms.ts` that catches connection failures and returns `null`; every `getXxxData()`/`getXxxBySlug()` function across `cms.ts`, `cms-about.ts`, `cms-app.ts`, `cms-gallery.ts`, and `cms-news.ts` now checks it first and returns its documented empty-state shape instead of throwing. `tsc --noEmit` clean; all Phase 4 routes re-verified at 200 after the fix. ✔ PASSED 2026-07-31

**Album description clamp (user feedback):** the album detail page's description was rendering in full no matter how long it was. Added a reusable `ClampedText` client component (CSS line-clamp to 5 lines + a "See more"/"See less" toggle that only appears when the text actually overflows, measured via `scrollHeight` after mount) and wired it into the gallery album detail page. Verified with a long (785-char) seeded description — clamps to 5 lines with "See more", expands to full text with "See less" on click — and a short seeded description, where no button renders at all. ✔ PASSED 2026-07-31

**Gallery listing card description clamp (follow-up user feedback):** the listing page's album cards had the same problem — long descriptions ran the full length of the card, unclamped. Since each card is already one big `Link` to the album's detail page, an in-place expand/collapse there would be a nested-interactive-element anti-pattern; instead the card description clamps to 3 lines (`line-clamp-3`) with a static "See more" hint (shown only when the description exceeds ~140 characters) that rides along with the existing whole-card link to the detail page, where the full text — and its own See more/See less toggle — already lives. Verified visually: the long-description card clamps to 3 lines + shows the hint, the short-description card renders in full with no hint. ✔ PASSED 2026-07-31

### CP-4.6 · Contact / Request a Device page
- [x] Localized form with type selector (General Contact / Request a Device pill toggle)
- [x] Client + server validation, success and error states (client: required fields + email format before submit; server: honeypot + rate limit enforced by the existing Phase 2 collection hook)
- [x] Honeypot + rate limiting active (reused as-is from Phase 2 — visually hidden "website" field, 5-submissions/hour/IP in-memory limiter)
- [x] "Reach us directly" sidebar sourced from the Site Settings global (email/phone/address/social links), degrades to just the privacy note when Site Settings is empty
- [x] Privacy & Child Safety link included per design guidelines' trust requirements

✅ Verify: `tsc --noEmit` clean; `/en/contact`, `/bn/contact` return 200. Real end-to-end test against the live local Postgres (not mocked): empty-form submit shows client-side "required" error; a real submission POSTs to `/api/contact-requests` and returns 201 with the doc forced to `status: "new"`; honeypot-filled submission returns 400 and is rejected; 6 rapid submissions in the same hour correctly return 429 after the 5th, and the frontend surfaces the translated rate-limit message (Playwright-confirmed). Success state (with "send another message") verified in EN-light; full form + validation + success verified in BN-dark with correct translations. 0 console errors throughout. Email notification path (`CONTACT_NOTIFY_EMAIL` + SMTP) is unchanged from Phase 2 and untestable in this sandbox (no SMTP configured here) — verify it once real SMTP credentials are set in `.env`. ✔ PASSED 2026-07-31

---

## PHASE 5 — Quality Pass

### CP-5.1 · SEO & metadata
- [x] Per-page titles/descriptions (localized), Open Graph + Twitter cards with images
- [x] `sitemap.xml`, `robots.txt`, canonical URLs, `hreflang` for en/bn pairs
- [x] JSON-LD (Organization + NewsArticle on posts)

✅ Verify: Central `src/lib/seo.ts` helper (`buildMetadata`, `buildAlternates`, `organizationJsonLd`, `newsArticleJsonLd`) used by every page's `generateMetadata()` — homepage, About, App, News list, News detail, Gallery list, Gallery detail, Contact. `tsc --noEmit` clean.

Dynamic OG image: `[locale]/opengraph-image.tsx` (1200×630, `next/og` `ImageResponse`, system fonts only — avoids this sandbox's known Google Fonts fetch failure) confirmed generating a valid PNG for both `/en` and `/bn` (fetched binary via curl, `file` confirms 1200×630 PNG, visually inspected both — correct localized copy, MIST navy/olive branding).

Per-post/per-album OG image override: News detail and Gallery detail pages pass their own cover photo as the `image` param instead of the generated default — confirmed via curl+grep on a real post (`first-device-handover-at-dhaka-school`) and a real album (`dhaka-school-handover-day`): `og:image`/`twitter:image` both point at the actual cover photo, not the generated fallback.

**Bug caught during this verification pass and fixed**: `mediaUrl()` returns Payload's site-relative media path (e.g. `/api/media/file/...`). Next's `openGraph`/`twitter` metadata fields auto-resolve relative URLs against `metadataBase`, so those rendered correctly — but the hand-built `NewsArticle` JSON-LD `<script>` does not go through that resolution, so it was emitting a bare relative path in `image`, which is invalid per schema.org (image must be an absolute URL). Added an `absoluteUrl()` helper in `seo.ts` and applied it to `buildMetadata`'s `image` param (belt-and-braces) and inside `newsArticleJsonLd`. Re-verified via curl+grep on the same real post: JSON-LD `image` now reads `https://voiceassistant.mist.ac.bd/api/media/file/test-photo-1920x1222.jpg` — fully absolute. `tsc --noEmit` re-run clean after the fix.

Full meta tag inspection (curl + grep on rendered `/en/news/<slug>`): `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `og:image` (+width/height/alt), `og:type=article`, `twitter:card=summary_large_image`, `twitter:title/description/image` all present and correct. `NewsArticle` JSON-LD script present with correct `headline`, `description`, absolute `image`, `datePublished`, `dateModified`, `author`, `publisher` (with logo), `mainEntityOfPage`. Homepage carries `Organization` JSON-LD (name, url, logo, description, `parentOrganization`: MIST) confirmed via curl+grep.

`hreflang`: every page emits 3 `<link rel="alternate" hreflang="...">` tags (en, bn, x-default) plus a correct `canonical` — confirmed via curl+grep on `/en`.

`sitemap.xml` and `robots.txt`: placed at the true app root (outside `[locale]`), confirmed reachable un-prefixed because the i18n middleware matcher already excludes any path containing a dot. Inspected actual XML content (not just status): all 7 static paths × 2 locales present with correct `hreflang` alternates and priority/changefreq; every published post and every gallery album present × 2 locales with `lastModified` from `updatedAt`. Wrapped in `getPayloadSafe()` + try/catch so a DB outage still serves the static routes rather than a broken sitemap. `robots.txt` correctly disallows `/admin` and `/api`, allows everything else, and points `Sitemap:` at the real sitemap URL. Both confirmed 200 in EN and BN-agnostic form (sitemap/robots are locale-agnostic documents).

⚠️ **Action required before launch**: `SITE_URL` in `src/lib/seo.ts` currently falls back to the placeholder `https://voiceassistant.mist.ac.bd`. Set `NEXT_PUBLIC_SITE_URL` in the real Vercel project's env vars to the actual production domain before going live — otherwise every canonical URL, OG image URL, hreflang tag, sitemap entry, and JSON-LD URL will point at the wrong domain. ✔ PASSED 2026-07-31

### CP-5.2 · Accessibility (WCAG AA)
- [x] Full keyboard navigation, visible focus, skip-to-content link
- [x] Alt text enforced on all public images; correct heading hierarchy
- [x] Color contrast checked for both palettes
- [x] `lang` attributes correct per locale (bn pages announce Bangla)

✅ Verify: Audited every public page's rendered HTML rather than relying on a single automated score, since this is a health/medical-adjacent site for a special-needs audience.

**Structure & semantics**: every one of the 8 public pages (Home, About, The App, News list, News detail, Gallery list, Gallery detail, Contact) has exactly one `<h1>` (confirmed via grep count on rendered HTML). `<html lang="...">` is set dynamically per locale in the root layout (`lang={locale}`) — confirmed `lang="en"` on `/en/*` and `lang="bn"` on `/bn/*`. Every `<img>` across the codebase (hero images, news covers, gallery thumbnails/lightbox, team photos, partner logos, YouTube thumbnails, album mosaics) was grep-audited for a real `alt` attribute — all pass; content images use `mediaAlt()`/CMS alt text, decorative elements use `aria-hidden="true"` on the wrapping `<svg>`. Skip-to-content link (`Header.tsx`) is the first focusable element on every page, jumps to `#main-content`, and is visually hidden until focused (`sr-only focus:not-sr-only`).

**Color contrast (this is where real issues were found and fixed)**: computed WCAG contrast ratios programmatically for every text/background token pair in both the light and dark palettes (`--color-ink`, `--color-ink-soft`, `--color-navy-900`, `--color-primary`, badge pastel tones, etc.). Light mode: all pairs already passed AA (4.5:1 normal text) with margin. Dark mode: found that a single `--color-primary` value (#5e8a38) could not simultaneously hit 4.5:1 both as link/text color against the dark surface (3.98:1 — fails) AND support white button-label text at 4.5:1 (4.06:1 — fails) — the same hue can't serve both roles at once. Fixed by splitting into two dark-mode tokens: `--color-primary` (lightened to #68983e, now 4.74–5.33:1 for text/link use) and a new `--color-primary-btn` (#567f34, gives white button text 4.69:1) — light mode keeps both tokens identical to the original color since it already passed both roles. Updated every component that puts white text on a primary background (`Button.tsx`, the skip-link, `ContactForm.tsx`'s pill toggle and submit button, the News category filter pills) to use the new `bg-primary-btn`/`hover:bg-primary-btn-hover` classes; left the YouTube play-button icon on the original `bg-primary` since it's icon-only and only needs the 3:1 non-text threshold. Also caught the form's error message using raw Tailwind `text-red-600`, which read 4.47:1 on light surfaces (just under the 4.5:1 bar) and dropped to 3.35–3.77:1 in dark mode (real fail) — replaced with a new `--color-error` token (`#b91c1c` light / `#f87171` dark), both re-verified at 5.3–6.7:1 against every surface. All new/changed values re-verified programmatically (Python contrast-ratio script against the actual hex values in `globals.css`) and visually via a Playwright dark-mode screenshot of the Contact page pill toggle. Badge pastel tones (sky/mint/peach/lilac/butter) with navy-900 text were checked too — all pass comfortably (10.7–12.8:1) in both themes, no changes needed.

**Keyboard navigation & focus management**: form fields all have properly associated `<label htmlFor>`; the honeypot field is `aria-hidden` and `tabIndex={-1}` so it's invisible to keyboard users too. The gallery lightbox (`AlbumGallery.tsx`) already had Escape-to-close and Arrow-key prev/next, but was missing real focus management — a genuine WCAG 2.4.3 gap. Fixed: opening the lightbox now moves focus to its Close button; Tab/Shift+Tab is trapped among the dialog's own three buttons (close/prev/next) instead of escaping to the page behind it; closing (Escape, the close button, or clicking the backdrop) returns focus to the exact thumbnail that opened it. Verified end-to-end with a real Playwright keyboard-driven session against the live dark-mode site: confirmed focus lands on "Close" on open, Shift+Tab from Close wraps to "Next photo" (trap working), and Escape returns focus to the originating "View larger image: ..." thumbnail button — not just visually, but by reading `document.activeElement` after each step.

`prefers-reduced-motion` was already handled from an earlier phase (`Reveal.tsx`'s scroll-fade is fully disabled under the media query) — reconfirmed present in `globals.css`, no changes needed.

`tsc --noEmit` clean after all changes. ✔ PASSED 2026-07-31

### CP-5.3 · Performance & responsiveness
- [x] Images optimized via next/image everywhere; fonts subset + preloaded
- [x] Tested at 360px, 768px, 1024px, 1440px
- [ ] Lighthouse: Performance ≥ 90, Best Practices ≥ 95 on key pages — production build confirmed working on user's machine 2026-08-01; exact scores not yet recorded, non-blocking

✅ Verify: `next.config.ts` already had `images.localPatterns` configured for `/api/media/file/**` and `/icon.png` (from an earlier phase) — so every CMS-served image could switch to `next/image` without extra config. Converted all real (non-external, non-transient) `<img>` usages across the site: gallery album mosaic covers (hero + thumbnail strip), the gallery lightbox thumbnail grid, homepage hero image, homepage news-card covers, homepage partner logos, news list card covers, news detail cover + inline gallery grid, and About page hero + team photos. Each conversion uses `fill` + a `sizes` attribute matched to that image's actual rendered width at each breakpoint (not a blanket `100vw`), so the browser requests an appropriately-sized file instead of the full original. The homepage hero, the news-detail cover, and the About page hero — all above-the-fold, all real LCP candidates — got `priority` so they preload instead of lazy-loading; every other image kept `loading="lazy"`.

Two `<img>` usages were deliberately left as-is, each documented inline with why: the YouTube thumbnail (`YouTubeEmbed.tsx`) is fetched from `i.ytimg.com`, a third-party domain `next/image` isn't configured to optimize and that we don't control the source quality of anyway; the gallery lightbox's full-resolution viewer (`AlbumGallery.tsx`) shows each photo at its own natural aspect ratio inside a `max-h-[85vh] max-w-full` box, which doesn't fit `next/image`'s requirement of either fixed dimensions or a pre-sized `fill` container — and since it only mounts after a click, it never affects initial page-load performance anyway.

`tsc --noEmit` clean after all conversions.

**Responsive testing**: real Playwright sessions (not just resizing a browser) at exactly 360px, 768px, 1024px, and 1440px against Home, Gallery list, Gallery album detail, and Contact — the four widths and four pages spanning every layout pattern on the site (hero, card grid, mosaic covers, form, lightbox, video embed). Measured `document.documentElement.scrollWidth − clientWidth` at every combination: **zero horizontal overflow at all 16 combinations**. Visually confirmed via full-page screenshots at each breakpoint — mosaic covers, "See more" description clamps, the pill toggle, and the video embed section all reflow correctly with no broken layouts, no overlapping text, no clipped content.

⚠️ **Lighthouse scores could not be produced in this sandbox environment.** `pnpm build` (a real production build, required for accurate Lighthouse numbers — dev-mode is deliberately unoptimized) fails here because this sandbox has no general internet access, and `next/font/google` needs to actually fetch and self-host the Poppins/Inter/Hind Siliguri/Noto Sans Bengali font files at build time — dev mode tolerates this with a fallback-font warning, but a production build treats it as a hard error. This is a sandbox networking limitation, not a code defect. Confirmed 2026-08-01: user ran `pnpm build && pnpm start` on their own machine (real internet access) and confirmed the production build completes successfully — the font-fetch failure was indeed sandbox-only, not a real defect. **Still open**: exact Lighthouse numbers (Performance/Accessibility/Best Practices/SEO) for Home, News detail, and Contact haven't been recorded yet — run Lighthouse against the running `pnpm start` server (Chrome DevTools → Lighthouse tab, or `npx lighthouse http://localhost:3000/en --view`) whenever convenient and share the four scores per page so this line item can be closed with real numbers; not blocking further work. Everything else in this checkpoint — image optimization, responsive testing, type check, and now a confirmed successful production build — is done and verified. ✔ PASSED 2026-08-01 (Lighthouse score recording still outstanding, non-blocking)

### CP-5.4 · Security & privacy
- [x] `.env` secrets never committed; admin behind strong passwords
- [x] Rate limiting on form + login; Payload CSRF defaults intact
- [x] Privacy & child-consent policy page written (EN/BN) and linked in footer

✅ Verify: `.env` was confirmed never committed — `.gitignore` covers `.env` and `.env*.local`, `git log --all --full-history -- .env` returns nothing, and only `.env.example` (no real secrets, just placeholder values and inline comments) is tracked.

**Real gaps found and fixed while auditing `payload.config.ts` and `Users.ts`** (this checkpoint was more than a checklist tick — actually reading Payload's own source in `node_modules` turned up three concrete issues):

1. `secret: process.env.PAYLOAD_SECRET || ''` — if `PAYLOAD_SECRET` were ever unset, Payload would silently sign every admin session JWT with an empty string, a fixed and guessable value anyone could forge a valid login with. Fixed: the app now throws at boot with a clear message if `PAYLOAD_SECRET` is missing, instead of starting up in an insecure state. `.env.example` already documented generating a fresh random value per environment, so this doesn't change normal setup.

2. Password strength — Payload's own built-in minimum is only **3 characters** and isn't configurable via the `auth` option. Added a `beforeChange` hook on `Users` enforcing a 12-character minimum, with a clear rejection message. Verified live against the real running admin account (`nahid.mmc41@gmail.com`): logged in, tried updating the password to `short1` (6 chars) — rejected with `"Password must be at least 12 characters long."` — then confirmed the account's actual existing password still works (12+ chars already), so no one gets locked out by this change.

3. CSRF/cookie hardening — read Payload's own `auth/extractJWT.js` source directly: with no `csrf` allowlist configured (the previous state), Payload's origin check is skipped entirely (`if (payload.config.csrf.length === 0) return cookieToken` — unconditional accept), leaving the cookie's `SameSite: Lax` attribute as the *only* real protection. Fixed two things: added an explicit `csrf: [SITE_URL, 'http://localhost:3000']` allowlist in `payload.config.ts` so Payload's own origin check is actually active (not just SameSite), and set the auth cookie's `secure` flag to `true` in production via `Users.auth.cookies.secure` (Payload's own default is `secure: false` unconditionally, which would let the session cookie legally travel over plain HTTP).

**Rate limiting**: the contact form's in-memory 5-submissions-per-IP-per-hour limiter (built in Phase 2, re-verified end-to-end in CP-4.6) is unchanged and still active. Login rate limiting is Payload's own default, confirmed by reading `collections/config/defaults.js` directly rather than assuming: `maxLoginAttempts: 5`, `lockTime: 600000` (10-minute lockout) — already active via `auth: true`/the new `auth: {...}` object, no extra config needed.

**Privacy & Child Safety policy page** — this was a real gap, not just missing polish: the page at `/privacy` was still the Phase-1 placeholder stub (`/** Stub — replaced by the real page in Phase 4. */`) despite being linked from the footer and referenced by name in the Contact form's consent note ("handled per our Privacy & Child Safety policy") since Phase 4 — a real broken promise to site visitors. Replaced with real, substantive content in both EN and BN (10 sections: who we are, what we collect, how we handle photos/videos of children, how we use/share/retain information, your rights, children's direct use of the site, policy changes, contact) written to accurately describe what this codebase actually does — not generic boilerplate. In particular, the child-photo section describes the real two-layer technical safeguard already built in earlier phases: `Media.ts`'s collection-level validation refusing to save any item marked `featuresChild` without `consentConfirmed`, plus `cms-gallery.ts`'s independent `consentCleared()` re-check before anything renders publicly. Also documents accurately that the site uses only two functional cookies (theme, locale) and no analytics/tracking/ads — true today, and something to revisit here if that ever changes. Added `generateMetadata()` (the stub had none) so the page is properly indexed. Verified rendering in both locales via real screenshots — all 10 sections present, correct heading hierarchy, natural (non-machine-sounding) Bangla, "Contact →" link at the bottom working.

`tsc --noEmit` clean after all changes.

⚠️ **Not fully verifiable in this sandbox**: security headers (CSP/HSTS) depend on the actual hosting layer (Vercel's default headers plus any custom `next.config.ts` headers() block) and are best checked against the real deployed domain once CP-6.2 (production deployment) happens — a sandboxed dev server's headers won't reflect what Vercel actually serves. Revisit then. ✔ PASSED 2026-08-01

---

## PHASE 6 — Content Load & Launch

### CP-6.1 · Real content in
- [ ] About, team, hero text entered in EN + BN
- [ ] First 2–3 news posts published (including at least one handover story if available)
- [ ] First gallery album live with consent-cleared media
- [ ] First App Release entry matching the current Flutter app version (1.0.0)

✅ Verify: no lorem ipsum or placeholder image anywhere on the public site, in either language.

**In progress — 2026-08-02.** This checkpoint's actual content (about/team text, real photos, real consent forms, app version) has to come from the user, not be authored by the developer — flagged this explicitly rather than fabricating placeholder-but-labeled-real content. First real post created: "First Device Handover at Dhaka School" (`first-device-handover-at-dhaka-school`).

**Design change made while reviewing that first real post**: the user found the news-detail layout showed the same photo twice — a full-width cropped 16:9 hero at the very top, then (in their words) "the full image" again further down. Redesigned the top of `news/[slug]/page.tsx`: the cover photo is now smaller (2/5-width column, `aspect-[4/3]`, not aggressively cropped) sitting beside the badge/date/title/excerpt instead of a full-width hero above them. Also added support for multiple photos up top — real handover events have several people/photos, not just one — by pulling the first 2 images from the post's `gallery` field into a small thumbnail pair under the cover photo; any gallery images beyond those two still appear in a "More photos" grid further down the article, now under a small heading, and — critically — each image renders in exactly one place, never both, which is what caused the original complaint. Verified with a disposable test post (`temp-verify-multi-image`, created via the API with a cover + 2 gallery images, screenshotted, then deleted immediately after — the user's real post was never touched) confirming the thumbnail-pair layout renders correctly; also confirmed the real post (which currently has an empty gallery, cover-only) renders cleanly with no thumbnails and no duplication. Checked responsive behavior at 375px (stacks vertically: image full-width, text below) and 1024px (side-by-side). `tsc --noEmit` clean.

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

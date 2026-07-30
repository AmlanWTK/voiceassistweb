# Design Tokens (CP-0.2)

Direction: **Warm pastel + institutional** — the app's calm pastel swatches for warmth and content cards, anchored by a deep institutional navy for headers, headings, and text, echoing MIST's formal identity without copying it.

## Color palette

### Institutional anchors

| Token | Hex | Use |
|---|---|---|
| `navy-900` | `#1C2A4A` | Headings, header/footer background, primary text on light |
| `navy-700` | `#2C3E66` | Secondary headings, hover states |
| `green-700` | `#1E7A46` | MIST-institutional accent (links to MIST, success states) — echoes the icon's green |
| `ink` | `#212121` | Body text (matches app `primaryText` black87) |
| `ink-soft` | `#5C5C5C` | Secondary text (app `secondaryText`) |

### Pastel swatches (from the app — `pastel_swatches.dart`)

Same low-saturation rotation the app uses, so the site visually *is* the app:

| Swatch | Background | Border | Glow/Accent |
|---|---|---|---|
| Sky | `#DCEEFB` | `#B8DCF2` | `#8FC7EA` |
| Mint | `#DFF5EC` | `#BFE6D3` | `#8FD4B0` |
| Peach | `#FDEAE0` | `#F3CBB3` | `#F0B08A` |
| Lilac | `#EDE7F9` | `#D8C9F0` | `#C3A8EA` |
| Butter | `#FBF3D9` | `#F0E1A0` | `#E8CE6E` |

### Surfaces (from the app — `app_colors.dart`)

| Token | Hex | Use |
|---|---|---|
| `bg` | `#F5F6F8` | Page background (app scaffold background) |
| `surface` | `#FFFFFF` | Cards, header |
| `border` | `#E0E0E0` | Card borders, dividers |

### Primary action

| Token | Hex | Use |
|---|---|---|
| `primary` | `#2F6FB6` | Buttons, links, CTA — a deeper, AA-contrast version of the app's sky glow `#8FC7EA` |
| `primary-hover` | `#265C99` | |

Contrast rules: body text `ink` on `bg`/`surface` (AAA); white text only on `navy-900`, `primary`, `green-700` (all ≥ 4.5:1 AA). Pastel backgrounds always carry `navy-900` or `ink` text — never white.

## Typography

| Role | Latin | Bangla |
|---|---|---|
| Headings | **Poppins** (600/700) | **Hind Siliguri** (600/700) |
| Body | **Inter** (400/500) | **Noto Sans Bengali** (400/500) |

Loaded via `next/font/google`, subset + preloaded. Bangla headings fall back to Hind Siliguri automatically through the locale font stack.

## Shape & feel

- Radius: cards `24px` (matches app cards), buttons `12px`, images `16px`
- Shadows: soft, low — `0 10px 20px rgb(0 0 0 / 0.08)` (matches app activation card)
- Spacing scale: Tailwind default (4px base)
- Motion: gentle 150–250ms ease-out; no flashing/parallax (sensory-friendly, mirrors the app's calm design philosophy)

## Tone alignment with mist.ac.bd

From analysis of mist.ac.bd: institutional, news-forward layout; formal leadership messaging; dense chronological news lists. We adopt: a prominent News section, an institutional footer with MIST affiliation, and formal navy anchors — while keeping generous whitespace and pastel warmth that the audience (parents of special children) needs. Reference screenshots to be added to `content/assets/mist-reference/` when captured.

import type { Metadata } from 'next'

import { routing } from '@/i18n/routing'

/** Canonical production URL. MUST be overridden via NEXT_PUBLIC_SITE_URL
 *  once the real domain is chosen — this placeholder is only safe for
 *  local development and preview builds. Set it in Vercel's env vars
 *  before launch (see CP-5.1 in CHECKPOINTS.md). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceassistant.mist.ac.bd').replace(
  /\/$/,
  '',
)

/** Payload media URLs (`mediaUrl()`) are site-relative (`/api/media/...`).
 *  Open Graph/Twitter meta tags get resolved against `metadataBase`
 *  automatically by Next, but hand-built JSON-LD does not go through that
 *  resolution — so anything placed in a `<script type="application/ld+json">`
 *  must be made absolute explicitly, or it does. */
function absoluteUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Builds the `alternates` block for a given path: a canonical URL for the
 *  current locale plus hreflang entries for every locale (+ x-default). */
export function buildAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  }
}

/** Standard per-page metadata: title, description, canonical + hreflang,
 *  Open Graph, and Twitter card. Pages that have a real photo (e.g. a news
 *  post cover) pass `image` to override the site's default generated OG
 *  image; pages that don't just inherit it from the locale segment's
 *  opengraph-image.tsx. */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  siteName,
  image,
  type = 'website',
}: {
  locale: string
  path: string
  title: string
  description: string
  siteName: string
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`
  const ogLocale = locale === 'bn' ? 'bn_BD' : 'en_US'

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: ogLocale,
      type,
      ...(image ? { images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [absoluteUrl(image)] } : {}),
    },
  }
}

/** Organization structured data — placed on the homepage per standard SEO
 *  practice (a site only needs one Organization node, not one per page). */
export function organizationJsonLd(locale: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Voice Assistant',
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/icon.png`,
    description,
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Military Institute of Science and Technology (MIST)',
      url: 'https://mist.ac.bd',
    },
  }
}

/** NewsArticle structured data for a single published post. */
export function newsArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedDate,
  updatedDate,
}: {
  title: string
  description?: string
  url: string
  image?: string | null
  publishedDate: string
  updatedDate?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description || undefined,
    image: image ? [absoluteUrl(image)] : undefined,
    datePublished: publishedDate,
    dateModified: updatedDate || publishedDate,
    author: { '@type': 'Organization', name: 'Voice Assistant' },
    publisher: {
      '@type': 'Organization',
      name: 'Voice Assistant',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

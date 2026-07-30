import { getPayload } from 'payload'

import config from '@/payload.config'

export type CmsLocale = 'en' | 'bn'

/** All data the homepage needs, fetched in parallel. Never throws — every
 *  slot degrades to null/[] so the page renders even with an empty CMS. */
export async function getHomeData(locale: CmsLocale) {
  const payload = await getPayload({ config })

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn()
    } catch {
      return fallback
    }
  }

  const [home, posts, stories, partners, outreach] = await Promise.all([
    safe(() => payload.findGlobal({ slug: 'home-page', locale, depth: 1 }), null),
    safe(
      () =>
        payload
          .find({
            collection: 'posts',
            locale,
            depth: 1,
            limit: 3,
            sort: '-publishedDate',
            where: { _status: { equals: 'published' } },
          })
          .then((r) => r.docs),
      [],
    ),
    safe(
      () =>
        payload
          .find({
            collection: 'success-stories',
            locale,
            depth: 1,
            limit: 2,
            sort: 'displayOrder',
            where: { featured: { equals: true } },
          })
          .then((r) => r.docs),
      [],
    ),
    safe(
      () =>
        payload
          .find({ collection: 'partners', locale, depth: 1, limit: 12, sort: 'displayOrder' })
          .then((r) => r.docs),
      [],
    ),
    safe(
      () =>
        payload
          .find({
            collection: 'milestones',
            locale,
            depth: 0,
            limit: 3,
            sort: '-date',
            where: { type: { equals: 'outreach' } },
          })
          .then((r) => r.docs),
      [],
    ),
  ])

  return { home, posts, stories, partners, outreach }
}

/** Best available URL for a media doc at a given size, with fallbacks. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mediaUrl = (media: any, size: 'thumb' | 'card' | 'hero' = 'card'): string | null => {
  if (!media || typeof media !== 'object') return null
  return media.sizes?.[size]?.url || media.url || null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mediaAlt = (media: any): string =>
  media && typeof media === 'object' ? media.alt || '' : ''

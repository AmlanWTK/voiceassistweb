import { getPayload } from 'payload'

import config from '@/payload.config'

export type CmsLocale = 'en' | 'bn'

/** Resolves the Payload instance, or null if it can't connect (e.g. a
 *  dropped/idle-timed-out Postgres connection, common with pooled
 *  serverless Postgres like Neon during local dev). Every getXxxData()
 *  function below checks this before querying, so a transient DB hiccup
 *  degrades the page to its fallback content instead of crashing it. */
export async function getPayloadSafe() {
  try {
    return await getPayload({ config })
  } catch (err) {
    console.error('[cms] getPayload() failed — page will render with fallback content:', err)
    return null
  }
}

/** All data the homepage needs, fetched in parallel. Never throws — every
 *  slot degrades to null/[] so the page renders even with an empty CMS. */
export async function getHomeData(locale: CmsLocale) {
  const empty = { home: null, posts: [], stories: [], partners: [], outreach: [] }
  const payload = await getPayloadSafe()
  if (!payload) return empty

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

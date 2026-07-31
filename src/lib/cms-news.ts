import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import type { CmsLocale } from './cms'
import type { Post, AppRelease } from '@/payload-types'

const PAGE_SIZE = 9

export type PostCategory = 'handover' | 'app-update' | 'milestone'

const safe = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

/** Listing data for /news — published posts only, optional category filter,
 *  paginated. When the "app-update" category is active, also pulls the
 *  App Releases changelog so that tab shows real version history. */
export async function getNewsListData(
  locale: CmsLocale,
  opts: { category?: PostCategory; page?: number } = {},
) {
  const payload = await getPayload({ config })
  const page = Math.max(1, opts.page ?? 1)

  const where: Where = { _status: { equals: 'published' } }
  if (opts.category) where.category = { equals: opts.category }

  const [result, appReleases] = await Promise.all([
    safe<{ docs: Post[]; totalPages?: number; page?: number; totalDocs?: number }>(
      () =>
        payload.find({
          collection: 'posts',
          locale,
          depth: 1,
          limit: PAGE_SIZE,
          page,
          sort: '-publishedDate',
          where,
        }),
      { docs: [], totalPages: 1, page: 1, totalDocs: 0 },
    ),
    opts.category === 'app-update'
      ? safe<AppRelease[]>(
          () =>
            payload
              .find({ collection: 'app-releases', locale, depth: 0, limit: 20, sort: '-releaseDate' })
              .then((r) => r.docs),
          [],
        )
      : Promise.resolve<AppRelease[]>([]),
  ])

  return {
    posts: result.docs,
    totalPages: result.totalPages || 1,
    currentPage: result.page || 1,
    totalDocs: result.totalDocs || 0,
    appReleases,
  }
}

/** A single published post by slug, or null if it doesn't exist / isn't
 *  published (drafts are already filtered out by the collection's public
 *  access rule, so an unpublished slug simply returns no docs here). */
export async function getPostBySlug(locale: CmsLocale, slug: string) {
  const payload = await getPayload({ config })
  return safe<Post | null>(
    () =>
      payload
        .find({
          collection: 'posts',
          locale,
          depth: 1,
          limit: 1,
          where: { slug: { equals: slug }, _status: { equals: 'published' } },
        })
        .then((r) => r.docs[0] ?? null),
    null,
  )
}

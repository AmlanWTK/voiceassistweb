import { getPayload } from 'payload'

import config from '@/payload.config'
import type { CmsLocale } from './cms'
import type { GalleryAlbum, Media } from '@/payload-types'

const safe = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

/** Defensive consent guard: even though the Media collection refuses to save
 *  a child photo without confirmed consent, we never trust that guarantee
 *  blindly on the public site — any doc that somehow features a child
 *  without confirmed consent is filtered out before it can render. */
export const consentCleared = (media: number | Media | null | undefined): media is Media => {
  if (!media || typeof media !== 'object') return false
  if (media.featuresChild && !media.consentConfirmed) return false
  return true
}

export async function getGalleryListData(locale: CmsLocale) {
  const payload = await getPayload({ config })
  const albums = await safe<GalleryAlbum[]>(
    () =>
      payload
        .find({ collection: 'gallery-albums', locale, depth: 1, limit: 50, sort: 'displayOrder' })
        .then((r) => r.docs),
    [],
  )
  return { albums }
}

export async function getAlbumBySlug(locale: CmsLocale, slug: string) {
  const payload = await getPayload({ config })
  return safe<GalleryAlbum | null>(
    () =>
      payload
        .find({
          collection: 'gallery-albums',
          locale,
          depth: 1,
          limit: 1,
          where: { slug: { equals: slug } },
        })
        .then((r) => r.docs[0] ?? null),
    null,
  )
}

import type { MetadataRoute } from 'next'

import { getPayloadSafe } from '@/lib/cms'
import { SITE_URL } from '@/lib/seo'
import { routing } from '@/i18n/routing'

const STATIC_PATHS = ['', '/about', '/app', '/news', '/gallery', '/contact', '/privacy']

const alternatesFor = (path: string) => {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) languages[locale] = `${SITE_URL}/${locale}${path}`
  return languages
}

/** Sitemap covering every static page in both locales, plus every
 *  published news post and every gallery album (both locale-agnostic,
 *  slugs are shared across en/bn). Lives at the true app root — outside
 *  the [locale] segment — since a sitemap is one document for the whole
 *  site, not one per locale. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        alternates: { languages: alternatesFor(path) },
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      })
    }
  }

  const payload = await getPayloadSafe()
  if (payload) {
    try {
      const posts = await payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        limit: 1000,
        depth: 0,
        select: { slug: true, updatedAt: true },
      })
      for (const post of posts.docs) {
        const path = `/news/${post.slug}`
        for (const locale of routing.locales) {
          entries.push({
            url: `${SITE_URL}/${locale}${path}`,
            alternates: { languages: alternatesFor(path) },
            lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      }

      const albums = await payload.find({
        collection: 'gallery-albums',
        limit: 1000,
        depth: 0,
        select: { slug: true, updatedAt: true },
      })
      for (const album of albums.docs) {
        const path = `/gallery/${album.slug}`
        for (const locale of routing.locales) {
          entries.push({
            url: `${SITE_URL}/${locale}${path}`,
            alternates: { languages: alternatesFor(path) },
            lastModified: album.updatedAt ? new Date(album.updatedAt) : undefined,
            changeFrequency: 'monthly',
            priority: 0.5,
          })
        }
      }
    } catch {
      // If the DB is unreachable, the sitemap still returns the static
      // routes above rather than failing the whole request.
    }
  }

  return entries
}

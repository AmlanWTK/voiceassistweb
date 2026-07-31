import React from 'react'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'

import { getGalleryListData, consentCleared } from '@/lib/cms-gallery'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { Card } from '@/components/ui/Card'
import { AlbumCoverMosaic } from '@/components/ui/AlbumCoverMosaic'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'galleryPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return { title: `${t('hero.title')} — ${tSite('name')}` }
}

/** CP-4.5 · Gallery listing — one card per album, cover pulled from its
 *  first consent-cleared image. */
export default async function GalleryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, format, data] = await Promise.all([
    getTranslations('galleryPage'),
    getFormatter(),
    getGalleryListData(locale as CmsLocale),
  ])
  const { albums } = data

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-mist-green">
              {t('hero.eyebrow')}
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t('hero.title')}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {t('hero.lede')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {albums.length === 0 ? (
          <Reveal className="mx-auto max-w-md py-16 text-center">
            <p className="text-xl font-bold text-navy-900">{t('empty.title')}</p>
            <p className="mt-3 text-ink-soft">{t('empty.body')}</p>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {albums.map((album, i) => {
              const clearedImages = (album.images || []).filter(consentCleared)
              const coverTiles = clearedImages.slice(0, 4).map((img) => ({
                id: img.id,
                url: mediaUrl(img, 'card') || '',
                alt: mediaAlt(img),
              }))
              return (
                <Reveal key={album.id} delay={(i % 6) * 80}>
                  <Link href={`/gallery/${album.slug}`}>
                    <Card className="group flex h-full flex-col overflow-hidden">
                      <AlbumCoverMosaic images={coverTiles} totalCount={clearedImages.length} />
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-lg font-bold leading-snug hover:text-primary">
                            {album.title}
                          </h2>
                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-navy-700 shadow-soft transition-transform duration-200 group-hover:translate-y-0.5"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs font-medium text-ink-soft">
                          {album.eventDate && (
                            <time>{format.dateTime(new Date(album.eventDate), { dateStyle: 'medium' })}</time>
                          )}
                          {clearedImages.length > 0 && (
                            <span>{t('photoCount', { count: clearedImages.length })}</span>
                          )}
                        </div>
                        {album.description && (
                          <div className="mt-2 flex-1">
                            <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">
                              {album.description}
                            </p>
                            {album.description.length > 140 && (
                              <span className="mt-1 inline-block text-sm font-semibold text-primary">
                                {t('seeMore')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

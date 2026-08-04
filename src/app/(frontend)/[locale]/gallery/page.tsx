import React from 'react'
import Image from 'next/image'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { getGalleryListData, consentCleared } from '@/lib/cms-gallery'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import { Link } from '@/i18n/navigation'

/** Bento-grid column spans (out of 12), repeating every 3 tiles so a wall
 *  of any length keeps the same rhythm: narrow → wide → medium, then
 *  mirrored wide → medium → narrow, like the reference layout the user
 *  provided. Desktop (md+) only — mobile falls back to a plain 2-up grid,
 *  see the className below. */
const BENTO_SPANS = ['md:col-span-4', 'md:col-span-5', 'md:col-span-3', 'md:col-span-5', 'md:col-span-4', 'md:col-span-3']

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'galleryPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '/gallery',
    title: `${t('hero.title')} — ${tSite('name')}`,
    description: t('hero.lede'),
    siteName: tSite('name'),
  })
}

/** CP-4.5 · Gallery listing — one card per album, cover pulled from its
 *  first consent-cleared image. */
export default async function GalleryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, data] = await Promise.all([
    getTranslations('galleryPage'),
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-12 md:auto-rows-[15rem] lg:auto-rows-[17rem]">
            {albums.map((album, i) => {
              const clearedImages = (album.images || []).filter(consentCleared)
              const cover = clearedImages[0]
              const coverUrl = mediaUrl(cover, 'card')
              return (
                <Reveal
                  key={album.id}
                  delay={(i % 6) * 80}
                  className={`aspect-square md:aspect-auto ${BENTO_SPANS[i % BENTO_SPANS.length]}`}
                >
                  <Link
                    href={`/gallery/${album.slug}`}
                    className="group relative block h-full w-full overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-shadow duration-200 hover:shadow-lg"
                  >
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={mediaAlt(cover) || album.title}
                        fill
                        loading="lazy"
                        sizes="(min-width: 768px) 40vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-sky-bg" />
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                      <div className="p-4 backdrop-blur-sm">
                        <p className="font-heading text-sm font-bold text-white sm:text-base">
                          {album.title}
                        </p>
                      </div>
                    </div>
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

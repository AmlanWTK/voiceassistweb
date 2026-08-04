import React from 'react'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'

import { getAlbumBySlug, consentCleared } from '@/lib/cms-gallery'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { AlbumGallery } from '@/components/AlbumGallery'
import { ClampedText } from '@/components/ClampedText'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { youTubeId } from '@/lib/youtube'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const album = await getAlbumBySlug(locale as CmsLocale, slug)
  if (!album) return { title: tSite('name') }
  const cover = mediaUrl((album.images || []).filter(consentCleared)[0], 'hero')
  return buildMetadata({
    locale,
    path: `/gallery/${album.slug}`,
    title: `${album.title} — ${tSite('name')}`,
    description: album.description || tSite('tagline'),
    siteName: tSite('name'),
    image: cover || undefined,
  })
}

/** CP-4.5 · Gallery album detail — lightbox photo grid + video section.
 *  Only consent-cleared images are ever passed to the client gallery. */
export default async function AlbumDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)

  const [t, format, album] = await Promise.all([
    getTranslations('galleryPage'),
    getFormatter(),
    getAlbumBySlug(locale as CmsLocale, slug),
  ])

  if (!album) notFound()

  const images = (album.images || [])
    .filter(consentCleared)
    .map((img) => ({ id: img.id, url: mediaUrl(img, 'card') || '', alt: mediaAlt(img) }))
    .filter((img) => img.url)

  const videoEmbeds = Array.isArray(album.videoEmbeds) ? album.videoEmbeds : []

  // The title + description sit beside the photo grid (filling the empty
  // space next to a small number of images) when there are images to show
  // them alongside. Albums with no images yet (or all pending consent) fall
  // back to the plain centered hero below, so the copy is never lost.
  const titleAndDescription = (
    <>
      {album.eventDate && (
        <p className="text-xs font-medium uppercase tracking-widest text-mist-green">
          {format.dateTime(new Date(album.eventDate), { dateStyle: 'long' })}
        </p>
      )}
      <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{album.title}</h1>
      {album.description && (
        <div className="mt-5">
          <ClampedText
            text={album.description}
            lines={8}
            className="text-lg leading-relaxed text-ink-soft sm:text-xl"
            moreLabel={t('seeMore')}
            lessLabel={t('seeLess')}
          />
        </div>
      )}
    </>
  )

  return (
    <div>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <Reveal>
            <Link
              href="/gallery"
              className="group/back inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 group-hover/back:-translate-x-1"
              >
                ←
              </span>
              {t('back')}
            </Link>
            {images.length === 0 && (
              <div className="mt-6 text-left sm:text-center">{titleAndDescription}</div>
            )}
          </Reveal>
        </div>
      </section>

      {images.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          {/* Image column modestly wider than the text column (subtle 55/45
              asymmetry, not a dramatic split) with lg:items-start so the
              title lines up with the top edge of the image rather than
              floating at vertical center. */}
          <div className="grid gap-10 lg:grid-cols-[11fr_9fr] lg:items-start">
            <Reveal>
              <AlbumGallery images={images} />
            </Reveal>
            <Reveal className="text-left">
              <div className="lg:sticky lg:top-24">{titleAndDescription}</div>
            </Reveal>
          </div>
        </section>
      )}

      {videoEmbeds.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <Reveal>
              <SectionHeading eyebrow={t('videos.eyebrow')} title={t('videos.title')} />
            </Reveal>
            <div className="mt-12 space-y-10">
              {videoEmbeds
                .filter((v) => youTubeId(v.url))
                .map((v, i) => (
                  <Reveal key={v.url} delay={(i % 6) * 80}>
                    <YouTubeEmbed url={v.url} title={v.caption || album.title} />
                    {v.caption && <p className="mt-3 text-sm text-ink-soft">{v.caption}</p>}
                  </Reveal>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

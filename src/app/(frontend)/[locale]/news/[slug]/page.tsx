import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPostBySlug } from '@/lib/cms-news'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { SITE_URL, buildMetadata, newsArticleJsonLd } from '@/lib/seo'
import { Badge, categoryTone } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { youTubeId } from '@/lib/youtube'
import { ShareButtons } from '@/components/ShareButtons'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const post = await getPostBySlug(locale as CmsLocale, slug)
  if (!post) return { title: tSite('name') }
  const cover = mediaUrl(post.coverImage, 'hero')
  return buildMetadata({
    locale,
    path: `/news/${post.slug}`,
    title: `${post.title} — ${tSite('name')}`,
    description: post.excerpt || tSite('tagline'),
    siteName: tSite('name'),
    type: 'article',
    image: cover || undefined,
  })
}

/** CP-4.4 · News post detail — cover, rich body, gallery, video embeds,
 *  publish date, share buttons. Drafts and unknown slugs both 404, since
 *  getPostBySlug only ever returns published posts. */
export default async function NewsDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)

  const [t, tCat, format, post] = await Promise.all([
    getTranslations('newsDetail'),
    getTranslations('newsCategories'),
    getFormatter(),
    getPostBySlug(locale as CmsLocale, slug),
  ])

  if (!post) notFound()

  const cover = mediaUrl(post.coverImage, 'hero')
  const galleryImages = Array.isArray(post.gallery) ? post.gallery : []
  // CP-6.1 design update: a handover event usually has several photos (of
  // different children/staff), not just one cover shot. The first couple of
  // gallery images now ride along beside the cover as a small thumbnail
  // cluster at the top of the article; anything beyond that still appears
  // in the full "More photos" grid further down — each image renders in
  // exactly one place, never both, which is what the old "same photo twice"
  // layout got wrong.
  const topThumbs = galleryImages.slice(0, 2)
  const moreGalleryImages = galleryImages.slice(2)
  const youtubeUrls: { url: string }[] = Array.isArray(post.youtubeUrls) ? post.youtubeUrls : []
  const pageUrl = `${SITE_URL}/${locale}/news/${post.slug}`

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            newsArticleJsonLd({
              title: post.title,
              description: post.excerpt || undefined,
              url: pageUrl,
              image: cover,
              publishedDate: post.publishedDate,
              updatedDate: post.updatedAt,
            }),
          ),
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <Link href="/news" className="text-sm font-semibold text-primary hover:underline">
            ← {t('back')}
          </Link>
        </Reveal>

        <Reveal delay={60} className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          {cover && (
            <div className="sm:w-2/5 sm:shrink-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line shadow-soft">
                <Image
                  src={cover}
                  alt={mediaAlt(post.coverImage)}
                  fill
                  sizes="(min-width: 640px) 40vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
              {topThumbs.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {topThumbs.map((img, i) => {
                    const url = mediaUrl(img, 'card')
                    if (!url) return null
                    return (
                      <div
                        key={i}
                        className="relative aspect-square w-full overflow-hidden rounded-img border border-line"
                      >
                        <Image
                          src={url}
                          alt={mediaAlt(img)}
                          fill
                          loading="lazy"
                          sizes="20vw"
                          className="object-cover"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Badge tone={categoryTone[post.category] || 'sky'}>{tCat(post.category)}</Badge>
              <time className="text-xs font-medium text-ink-soft">
                {format.dateTime(new Date(post.publishedDate), { dateStyle: 'long' })}
              </time>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="prose prose-lg mt-10 max-w-none leading-relaxed text-ink-soft">
            <RichText data={post.body} />
          </div>
        </Reveal>

        {youtubeUrls.length > 0 && (
          <Reveal delay={180} className="mt-10 space-y-6">
            {youtubeUrls
              .filter((v) => youTubeId(v.url))
              .map((v) => (
                <YouTubeEmbed key={v.url} url={v.url} title={post.title} />
              ))}
          </Reveal>
        )}

        {moreGalleryImages.length > 0 && (
          <Reveal delay={220} className="mt-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-mist-green">
              {t('morePhotos')}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {moreGalleryImages.map((img, i) => {
                const url = mediaUrl(img, 'card')
                if (!url) return null
                return (
                  <div
                    key={i}
                    className="relative aspect-square w-full overflow-hidden rounded-img border border-line"
                  >
                    <Image
                      src={url}
                      alt={mediaAlt(img)}
                      fill
                      loading="lazy"
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </Reveal>
        )}

        <Reveal delay={240} className="mt-12 border-t border-line pt-8">
          <ShareButtons url={pageUrl} title={post.title} />
        </Reveal>
      </article>
    </div>
  )
}

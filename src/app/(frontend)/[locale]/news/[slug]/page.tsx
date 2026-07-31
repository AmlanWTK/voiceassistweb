import React from 'react'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPostBySlug } from '@/lib/cms-news'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { Badge, categoryTone } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { youTubeId } from '@/lib/youtube'
import { ShareButtons } from '@/components/ShareButtons'
import { Link } from '@/i18n/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceassistant.mist.ac.bd'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const post = await getPostBySlug(locale as CmsLocale, slug)
  if (!post) return { title: tSite('name') }
  return {
    title: `${post.title} — ${tSite('name')}`,
    description: post.excerpt || undefined,
  }
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
  const youtubeUrls: { url: string }[] = Array.isArray(post.youtubeUrls) ? post.youtubeUrls : []
  const pageUrl = `${SITE_URL}/${locale}/news/${post.slug}`

  return (
    <div>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <Link href="/news" className="text-sm font-semibold text-primary hover:underline">
            ← {t('back')}
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <Badge tone={categoryTone[post.category] || 'sky'}>{tCat(post.category)}</Badge>
            <time className="text-xs font-medium text-ink-soft">
              {format.dateTime(new Date(post.publishedDate), { dateStyle: 'long' })}
            </time>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
        </Reveal>

        {cover && (
          <Reveal delay={80}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={mediaAlt(post.coverImage)}
              className="mt-8 aspect-[16/9] w-full rounded-card border border-line object-cover shadow-soft"
            />
          </Reveal>
        )}

        <Reveal delay={120}>
          <div className="prose prose-lg mt-10 max-w-none leading-relaxed text-ink-soft">
            <RichText data={post.body} />
          </div>
        </Reveal>

        {youtubeUrls.length > 0 && (
          <Reveal delay={160} className="mt-10 space-y-6">
            {youtubeUrls
              .filter((v) => youTubeId(v.url))
              .map((v) => (
                <YouTubeEmbed key={v.url} url={v.url} title={post.title} />
              ))}
          </Reveal>
        )}

        {galleryImages.length > 0 && (
          <Reveal delay={200} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {galleryImages.map((img, i) => {
              const url = mediaUrl(img, 'card')
              if (!url) return null
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={mediaAlt(img)}
                  className="aspect-square w-full rounded-img border border-line object-cover"
                />
              )
            })}
          </Reveal>
        )}

        <Reveal delay={240} className="mt-12 border-t border-line pt-8">
          <ShareButtons url={pageUrl} title={post.title} />
        </Reveal>
      </article>
    </div>
  )
}

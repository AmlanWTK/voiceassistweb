import React from 'react'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getNewsListData, type PostCategory } from '@/lib/cms-news'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { Badge, categoryTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'newsPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return { title: `${t('hero.title')} — ${tSite('name')}` }
}

const CATEGORIES: PostCategory[] = ['handover', 'app-update', 'milestone']

/** CP-4.4 · News & Updates listing — category filter + pagination.
 *  Only published posts are ever fetched (enforced by the Posts collection's
 *  public access rule), so a direct URL to a draft never surfaces here. */
export default async function NewsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { locale } = await props.params
  const { category: rawCategory, page: rawPage } = await props.searchParams
  setRequestLocale(locale)

  const category = CATEGORIES.includes(rawCategory as PostCategory)
    ? (rawCategory as PostCategory)
    : undefined
  const page = Math.max(1, Number(rawPage) || 1)

  const [t, tCat, format, data] = await Promise.all([
    getTranslations('newsPage'),
    getTranslations('newsCategories'),
    getFormatter(),
    getNewsListData(locale as CmsLocale, { category, page }),
  ])
  const { posts, totalPages, currentPage, appReleases } = data

  const filterHref = (cat?: PostCategory) => (cat ? `/news?category=${cat}` : '/news')

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

      {/* Category filters */}
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <Reveal>
          <nav aria-label={t('hero.eyebrow')} className="flex flex-wrap justify-center gap-3">
            <Link
              href={filterHref(undefined)}
              aria-current={!category ? 'page' : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                !category
                  ? 'border-primary bg-primary text-white'
                  : 'border-line bg-surface text-navy-700 hover:border-primary hover:text-primary'
              }`}
            >
              {t('filters.all')}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={filterHref(cat)}
                aria-current={category === cat ? 'page' : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  category === cat
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-surface text-navy-700 hover:border-primary hover:text-primary'
                }`}
              >
                {tCat(cat)}
              </Link>
            ))}
          </nav>
        </Reveal>
      </div>

      {/* Listing */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <Reveal className="mx-auto max-w-md py-16 text-center">
            <p className="text-xl font-bold text-navy-900">{t('empty.title')}</p>
            <p className="mt-3 text-ink-soft">{t('empty.body')}</p>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => {
              const cover = mediaUrl(p.coverImage, 'card')
              return (
                <Reveal key={p.id} delay={(i % 6) * 80}>
                  <Card className="flex h-full flex-col overflow-hidden">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={mediaAlt(p.coverImage)}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3">
                        <Badge tone={categoryTone[p.category] || 'sky'}>{tCat(p.category)}</Badge>
                        <time className="text-xs font-medium text-ink-soft">
                          {format.dateTime(new Date(p.publishedDate), { dateStyle: 'medium' })}
                        </time>
                      </div>
                      <h2 className="mt-3 text-lg font-bold leading-snug">
                        <Link href={`/news/${p.slug}`} className="hover:text-primary">
                          {p.title}
                        </Link>
                      </h2>
                      {p.excerpt && (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.excerpt}</p>
                      )}
                      <Link
                        href={`/news/${p.slug}`}
                        className="mt-4 text-sm font-semibold text-primary hover:underline"
                      >
                        {t('readMore')} →
                      </Link>
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Reveal className="mt-12 flex items-center justify-center gap-4">
            {currentPage > 1 && (
              <ButtonLink
                variant="secondary"
                href={`/news?${category ? `category=${category}&` : ''}page=${currentPage - 1}`}
              >
                ← {t('pagination.prev')}
              </ButtonLink>
            )}
            <span className="text-sm font-medium text-ink-soft">
              {t('pagination.page', { current: currentPage, total: totalPages })}
            </span>
            {currentPage < totalPages && (
              <ButtonLink
                variant="secondary"
                href={`/news?${category ? `category=${category}&` : ''}page=${currentPage + 1}`}
              >
                {t('pagination.next')} →
              </ButtonLink>
            )}
          </Reveal>
        )}
      </section>

      {/* App Updates tab: real version history from App Releases */}
      {category === 'app-update' && appReleases.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <Reveal>
              <SectionHeading eyebrow={t('changelog.eyebrow')} title={t('changelog.title')} />
            </Reveal>
            <div className="mt-12 space-y-8">
              {appReleases.map((release, i) => (
                <Reveal key={release.id} delay={(i % 6) * 80}>
                  <Card className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-heading text-lg font-bold text-navy-900">
                        v{release.version}
                      </span>
                      <Badge tone="sky">{release.platform}</Badge>
                      <time className="text-xs font-medium text-ink-soft">
                        {format.dateTime(new Date(release.releaseDate), { dateStyle: 'medium' })}
                      </time>
                    </div>
                    <div className="mt-3 text-sm leading-relaxed text-ink-soft">
                      <RichText data={release.changelog} />
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

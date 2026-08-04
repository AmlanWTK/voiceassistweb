import React from 'react'
import Image from 'next/image'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Link } from '@/i18n/navigation'
import { getHomeData, mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { buildMetadata, organizationJsonLd } from '@/lib/seo'
import { Badge, categoryTone } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QuoteBlock } from '@/components/ui/QuoteBlock'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatTile } from '@/components/ui/StatTile'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'

const pastelCycle = [
  'bg-sky-bg border-sky-border',
  'bg-mint-bg border-mint-border',
  'bg-peach-bg border-peach-border',
  'bg-lilac-bg border-lilac-border',
  'bg-butter-bg border-butter-border',
]

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '',
    title: `${tSite('name')} — ${tSite('tagline')}`,
    description: tSite('underConstruction'),
    siteName: tSite('name'),
  })
}

/** CP-4.1 · Homepage — 11-section story flow per content/design-guidelines.md */
export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, tSite, tCat, format, data] = await Promise.all([
    getTranslations('home'),
    getTranslations('site'),
    getTranslations('newsCategories'),
    getFormatter(),
    getHomeData(locale as CmsLocale),
  ])
  const { home, posts, stories, partners, outreach } = data

  const heroTitle = home?.hero?.missionStatement || tSite('tagline')
  const heroSub = home?.hero?.subtitle || tSite('underConstruction')
  const heroImg = mediaUrl(home?.hero?.image, 'hero')
  const stats = home?.stats?.filter((s) => typeof s.value === 'number' && s.label) ?? []
  const videoUrl = home?.featuredVideo?.youtubeUrl

  return (
    <div>
      {/* Organization structured data — one Organization node for the whole site */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(locale, tSite('underConstruction'))),
        }}
      />
      {/* 1 · Hero — powerful mission statement */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-mist-green">
              {t('hero.eyebrow')}
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{heroTitle}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{heroSub}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/contact" size="lg">
                {t('hero.ctaPrimary')}
              </ButtonLink>
              <ButtonLink href="/app" variant="secondary" size="lg">
                {t('hero.ctaSecondary')}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={150} className="relative">
            {heroImg ? (
              <Image
                src={heroImg}
                alt={mediaAlt(home?.hero?.image)}
                width={800}
                height={600}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="h-auto w-full rounded-card border border-line object-cover shadow-soft"
              />
            ) : (
              <div className="relative mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-card border border-line bg-surface shadow-soft">
                <Image src="/icon.png" alt="" width={160} height={160} className="h-40 w-40 rounded-3xl" />
                <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-16 w-16 rounded-2xl border-2 bg-mint-bg border-mint-border" />
                <div aria-hidden="true" className="absolute -top-4 -right-4 h-16 w-16 rounded-2xl border-2 bg-butter-bg border-butter-border" />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* 2 · Impact statistics */}
      {stats.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <Reveal>
              <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                {stats.map((s, i) => (
                  <StatTile key={i} value={s.value} suffix={s.suffix || undefined} label={s.label} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 3 · Why this project matters */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow={t('why.eyebrow')} title={t('why.title')} />
          <div className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-ink-soft">
            {home?.whyItMatters?.body ? <RichText data={home.whyItMatters.body} /> : <p>{t('why.body')}</p>}
          </div>
        </Reveal>
      </section>

      {/* 4 · Our solution */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <SectionHeading align="left" eyebrow={t('solution.eyebrow')} title={t('solution.title')} />
            <div className="mt-5 text-lg leading-relaxed text-ink-soft">
              {home?.ourSolution?.body ? <RichText data={home.ourSolution.body} /> : <p>{t('solution.body')}</p>}
            </div>
            <ButtonLink href="/app" variant="secondary" className="mt-7">
              {t('solution.cta')}
            </ButtonLink>
          </Reveal>
          {/* 5 · Application showcase */}
          <Reveal delay={100}>
            <Card className="p-8">
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-mist-green">
                {t('showcase.eyebrow')}
              </p>
              <h3 className="text-xl font-bold">{t('showcase.title')}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <li key={i}>
                    <span
                      className={`inline-block rounded-full border px-3.5 py-1.5 text-sm font-semibold text-navy-900 ${pastelCycle[i % 5]}`}
                    >
                      {t(`showcase.categories.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">{t('showcase.note')}</p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* 6 · Research and innovation */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow={t('research.eyebrow')} title={t('research.title')} lede={t('research.body')} />
        </Reveal>
        {videoUrl && (
          <Reveal delay={100} className="mx-auto mt-10 max-w-3xl">
            <YouTubeEmbed url={videoUrl} title={home?.featuredVideo?.caption || t('research.title')} />
          </Reveal>
        )}
      </section>

      {/* 7 · Success stories */}
      {stories.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal>
              <SectionHeading eyebrow={t('stories.eyebrow')} title={t('stories.title')} />
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {stories.map((s, i) => (
                <Reveal key={s.id} delay={i * 100}>
                  <QuoteBlock
                    quote={s.quote}
                    name={s.personName}
                    role={s.personRole}
                    photoUrl={mediaUrl(s.photo, 'thumb') || undefined}
                    photoAlt={mediaAlt(s.photo)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8 · Latest news and announcements */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow={t('news.eyebrow')} title={t('news.title')} />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => {
              const cover = mediaUrl(p.coverImage, 'card')
              return (
                <Reveal key={p.id} delay={i * 100}>
                  <Card className="group flex h-full flex-col overflow-hidden">
                    {cover && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={cover}
                          alt={mediaAlt(p.coverImage)}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3">
                        <Badge tone={categoryTone[p.category] || 'sky'}>{tCat(p.category)}</Badge>
                        <time className="text-xs font-medium text-ink-soft">
                          {format.dateTime(new Date(p.publishedDate), { dateStyle: 'medium' })}
                        </time>
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug">
                        <Link href={`/news/${p.slug}`} className="hover:text-primary">
                          {p.title}
                        </Link>
                      </h3>
                      {p.excerpt && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.excerpt}</p>}
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/news" variant="secondary">
              {t('news.viewAll')}
            </ButtonLink>
          </div>
        </section>
      )}

      {/* 9 · Device distribution and outreach */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow={t('outreach.eyebrow')} title={t('outreach.title')} lede={t('outreach.body')} />
          </Reveal>
          {outreach.length > 0 && (
            <ul className="mx-auto mt-10 max-w-2xl space-y-4">
              {outreach.map((m) => (
                <Reveal as="li" key={m.id}>
                  <Card className="flex items-center gap-4 p-5">
                    <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-mist-green" />
                    <div>
                      <p className="font-semibold">{m.title}</p>
                      <time className="text-sm text-ink-soft">
                        {format.dateTime(new Date(m.date), { dateStyle: 'medium' })}
                      </time>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </ul>
          )}
          <div className="mt-10 text-center">
            <ButtonLink href="/gallery" variant="secondary">
              {t('outreach.viewGallery')}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 10 · Partners and collaborators */}
      {partners.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow={t('partners.eyebrow')} title={t('partners.title')} />
          </Reveal>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {partners.map((p) => {
              const logo = mediaUrl(p.logo, 'thumb')
              const inner = logo ? (
                <Image
                  src={logo}
                  alt={p.name}
                  width={160}
                  height={56}
                  className="h-14 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                />
              ) : (
                <span className="font-heading text-lg font-bold text-navy-700">{p.name}</span>
              )
              return (
                <li key={p.id}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* 11 · Call to action */}
      <section className="bg-band-bg">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-band-text sm:text-4xl">{t('cta.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-band-text-soft">
              {t('cta.body')}
            </p>
            <ButtonLink href="/contact" size="lg" className="mt-9">
              {t('cta.button')}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

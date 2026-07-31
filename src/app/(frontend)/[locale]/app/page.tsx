import React from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { getAppPageData } from '@/lib/cms-app'
import type { CmsLocale } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'appPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '/app',
    title: `${t('hero.title')} — ${tSite('name')}`,
    description: t('hero.lede'),
    siteName: tSite('name'),
  })
}

const pastelCycle = [
  'bg-sky-bg border-sky-border',
  'bg-mint-bg border-mint-border',
  'bg-peach-bg border-peach-border',
  'bg-lilac-bg border-lilac-border',
  'bg-butter-bg border-butter-border',
]

/**
 * CP-4.3 · The App page — told as a story (challenge → solution → showcase),
 * mirroring every real capability in lib/features/ of the Flutter app.
 */
export default async function AppStoryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, tHome, data] = await Promise.all([
    getTranslations('appPage'),
    getTranslations('home'),
    getAppPageData(locale as CmsLocale),
  ])
  const { latestRelease, outreachMilestones } = data

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
            {latestRelease && (
              <p className="mt-6 text-sm font-medium text-ink-soft">
                {t('version.label')}: <span className="font-bold text-navy-900">{latestRelease.version}</span>
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* The challenge */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading align="left" eyebrow={t('challenge.eyebrow')} title={t('challenge.title')} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t('challenge.body')}</p>
        </Reveal>
      </section>

      {/* The solution */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading align="left" eyebrow={t('solution.eyebrow')} title={t('solution.title')} />
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t('solution.body')}</p>
          </Reveal>
        </div>
      </section>

      {/* Showcase: 16 communication categories */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow={t('categories.eyebrow')} title={t('categories.title')} />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 12 }, (_, i) => (
            <Reveal key={i} delay={(i % 4) * 60}>
              <Card
                className={`flex h-24 items-center justify-center border-2 p-4 text-center font-heading font-bold text-navy-900 ${pastelCycle[i % 5]}`}
              >
                {tHome(`showcase.categories.${i}`)}
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Study materials */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <SectionHeading align="left" eyebrow={t('study.eyebrow')} title={t('study.title')} />
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t('study.body')}</p>
          </Reveal>
          <Reveal delay={100}>
            <Card className="flex flex-wrap gap-2 p-8">
              {['অ আ ই ঈ', 'ক খ গ ঘ', 'A B C D', 'E F G H'].map((chip, i) => (
                <span
                  key={chip}
                  className={`rounded-full border px-4 py-2 font-heading text-lg font-bold text-navy-900 ${pastelCycle[i % 5]}`}
                >
                  {chip}
                </span>
              ))}
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Custom words */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading align="left" eyebrow={t('custom.eyebrow')} title={t('custom.title')} />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t('custom.body')}</p>
        </Reveal>
      </section>

      {/* Offline */}
      <section className="border-y border-line bg-band-bg">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-mist-green">
              {t('offline.eyebrow')}
            </p>
            <h2 className="text-3xl font-bold text-band-text sm:text-4xl">{t('offline.title')}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-band-text-soft">
              {t('offline.body')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Handover model */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow={t('handover.eyebrow')} title={t('handover.title')} lede={t('handover.body')} />
        </Reveal>
        {outreachMilestones.length > 0 && (
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
            {outreachMilestones.map((m) => (
              <Badge key={m.id} tone="peach">
                {m.title}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <ButtonLink href="/contact" size="lg">
            {t('cta')}
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}

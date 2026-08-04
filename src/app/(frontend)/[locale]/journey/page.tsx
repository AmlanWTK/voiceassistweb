import React from 'react'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'

import { getJourneyData } from '@/lib/cms-journey'
import { type CmsLocale } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import { TimelineItem } from '@/components/ui/TimelineItem'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'journeyPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '/journey',
    title: `${t('hero.title')} — ${tSite('name')}`,
    description: t('hero.lede'),
    siteName: tSite('name'),
  })
}

/** Our Journey — the full project timeline (every Milestone, oldest
 *  first). The About page keeps a short teaser of this same data with a
 *  link here; see cms-about.ts / cms-journey.ts. */
export default async function JourneyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, tMilestoneType, format, data] = await Promise.all([
    getTranslations('journeyPage'),
    getTranslations('milestoneType'),
    getFormatter(),
    getJourneyData(locale as CmsLocale),
  ])
  const { milestones } = data

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
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

      {milestones.length === 0 ? (
        <Reveal className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
          <p className="text-xl font-bold text-navy-900">{t('empty.title')}</p>
          <p className="mt-3 text-ink-soft">{t('empty.body')}</p>
        </Reveal>
      ) : (
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Reveal>
            <ol className="mt-2">
              {milestones.map((m, i) => (
                <TimelineItem
                  key={m.id}
                  date={format.dateTime(new Date(m.date), { dateStyle: 'medium' })}
                  title={m.title}
                  description={m.description || undefined}
                  type={(m.type as 'research' | 'release' | 'outreach' | 'award') || 'research'}
                  typeLabel={tMilestoneType(m.type)}
                  isLast={i === milestones.length - 1}
                />
              ))}
            </ol>
          </Reveal>
        </section>
      )}
    </div>
  )
}

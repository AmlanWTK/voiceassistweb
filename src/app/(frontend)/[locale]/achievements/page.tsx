import React from 'react'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'

import { getAchievementsData } from '@/lib/cms-achievements'
import { type CmsLocale } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatTile } from '@/components/ui/StatTile'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'achievementsPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '/achievements',
    title: `${t('hero.title')} — ${tSite('name')}`,
    description: t('hero.lede'),
    siteName: tSite('name'),
  })
}

/** Achievements page: "by the numbers" highlight cards (Achievements
 *  collection) plus awards & recognition (Milestones filtered to
 *  type: 'award' — an award is both a dated journey entry and a
 *  spotlight-worthy achievement, so it isn't duplicated into a second
 *  collection; see cms-achievements.ts). */
export default async function AchievementsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, format, data] = await Promise.all([
    getTranslations('achievementsPage'),
    getFormatter(),
    getAchievementsData(locale as CmsLocale),
  ])
  const { achievements, awards } = data
  const isEmpty = achievements.length === 0 && awards.length === 0

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

      {isEmpty && (
        <Reveal className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
          <p className="text-xl font-bold text-navy-900">{t('empty.title')}</p>
          <p className="mt-3 text-ink-soft">{t('empty.body')}</p>
        </Reveal>
      )}

      {/* By the numbers */}
      {achievements.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow={t('numbers.eyebrow')} title={t('numbers.title')} />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map((a, i) => (
              <Reveal key={a.id} delay={(i % 6) * 80}>
                <Card className="h-full p-8 text-center">
                  <StatTile value={a.value} suffix={a.suffix || undefined} label={a.title} />
                  {a.description && (
                    <p className="mt-4 text-sm leading-relaxed text-ink-soft">{a.description}</p>
                  )}
                  {a.date && (
                    <time className="mt-4 block text-xs font-medium text-ink-soft">
                      {format.dateTime(new Date(a.date), { dateStyle: 'medium' })}
                    </time>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Awards & recognition */}
      {awards.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
            <Reveal>
              <SectionHeading eyebrow={t('awards.eyebrow')} title={t('awards.title')} />
            </Reveal>
            <div className="mt-12 space-y-5">
              {awards.map((award, i) => (
                <Reveal key={award.id} delay={(i % 6) * 80}>
                  <Card className="flex flex-col gap-3 p-6 sm:flex-row sm:items-start sm:gap-6">
                    <Badge tone="butter" className="w-fit shrink-0">
                      {format.dateTime(new Date(award.date), { dateStyle: 'medium' })}
                    </Badge>
                    <div>
                      <h3 className="text-lg font-bold leading-snug">{award.title}</h3>
                      {award.awardingBody && (
                        <p className="mt-1 text-sm font-semibold text-mist-green">
                          {award.awardingBody}
                        </p>
                      )}
                      {award.description && (
                        <p className="mt-2 leading-relaxed text-ink-soft">{award.description}</p>
                      )}
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

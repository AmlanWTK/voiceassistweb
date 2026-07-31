import React from 'react'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getAboutData } from '@/lib/cms-about'
import { mediaUrl, mediaAlt, type CmsLocale } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TimelineItem } from '@/components/ui/TimelineItem'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'aboutPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '/about',
    title: `${t('hero.title')} — ${tSite('name')}`,
    description: t('hero.lede'),
    siteName: tSite('name'),
  })
}

/** CP-4.2 · About page — the project story, mission, team, and journey. */
export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, tMilestoneType, format, data] = await Promise.all([
    getTranslations('aboutPage'),
    getTranslations('milestoneType'),
    getFormatter(),
    getAboutData(locale as CmsLocale),
  ])
  const { about, team, milestones } = data

  const heroImg = mediaUrl(about?.heroImage, 'hero')

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

      {heroImg && (
        <Reveal className="mx-auto -mt-10 max-w-5xl px-4 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImg}
            alt={mediaAlt(about?.heroImage)}
            className="aspect-[21/9] w-full rounded-card border border-line object-cover shadow-soft"
          />
        </Reveal>
      )}

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <Reveal>
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-mist-green">
            {t('story.eyebrow')}
          </p>
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            {about?.story ? (
              <RichText data={about.story} />
            ) : (
              t('fallback.story')
                .split('\n\n')
                .map((para, i) => <p key={i}>{para}</p>)
            )}
          </div>
        </Reveal>
      </section>

      {/* Mission */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-mist-green">
              {t('mission.eyebrow')}
            </p>
            <div className="text-2xl font-semibold leading-snug text-navy-900">
              {about?.mission ? <RichText data={about.mission} /> : <p>{t('fallback.mission')}</p>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow={t('team.eyebrow')} title={t('team.title')} />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
            {team.map((member, i) => {
              const photo = mediaUrl(member.photo, 'thumb')
              return (
                <Reveal key={member.id} delay={(i % 4) * 80} className="text-center">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={mediaAlt(member.photo) || member.name}
                      className="mx-auto h-24 w-24 rounded-full border border-line object-cover shadow-soft"
                    />
                  ) : (
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-line bg-sky-bg font-heading text-2xl font-bold text-navy-900 shadow-soft">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <p className="mt-3 font-semibold text-navy-900">{member.name}</p>
                  <p className="text-sm text-ink-soft">{member.role}</p>
                </Reveal>
              )
            })}
          </div>
        </section>
      )}

      {/* Timeline */}
      {milestones.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <Reveal>
              <SectionHeading eyebrow={t('timeline.eyebrow')} title={t('timeline.title')} />
            </Reveal>
            <Reveal>
              <ol className="mt-12">
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
          </div>
        </section>
      )}

      {/* Acknowledgments */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-mist-green">
            {t('acknowledgments.eyebrow')}
          </p>
          <div className="text-lg leading-relaxed text-ink-soft">
            {about?.acknowledgments ? (
              <RichText data={about.acknowledgments} />
            ) : (
              <p>{t('fallback.acknowledgments')}</p>
            )}
          </div>
          <a
            href="https://mist.ac.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block font-semibold text-mist-green hover:underline"
          >
            {t('mistLink')} →
          </a>
        </Reveal>
      </section>
    </div>
  )
}

import React from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { buildMetadata } from '@/lib/seo'
import { Reveal } from '@/components/ui/Reveal'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'privacyPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return buildMetadata({
    locale,
    path: '/privacy',
    title: `${t('hero.title')} — ${tSite('name')}`,
    description: t('hero.lede'),
    siteName: tSite('name'),
  })
}

const SECTION_KEYS = [
  'whoWeAre',
  'dataWeCollect',
  'childConsent',
  'howWeUse',
  'sharing',
  'retentionSecurity',
  'yourRights',
  'childrenDirect',
  'changes',
  'contact',
] as const

/** CP-5.4 · Privacy & Child Safety policy — real content, not a stub.
 *  Written to accurately describe what this codebase actually does:
 *  the contact form's fields (see ContactRequests.ts), the two
 *  functional-only cookies (theme + locale), the absence of any
 *  analytics/tracking, and — most importantly — the two-layer technical
 *  safeguard around child photos/videos (Media.ts's collection-level
 *  validation requiring `consentConfirmed` before a `featuresChild` item
 *  can even be saved, plus cms-gallery.ts's independent `consentCleared()`
 *  re-check before anything is rendered publicly). Linked from the
 *  footer and referenced from the Contact page's form. */
export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const [t, tNav] = await Promise.all([getTranslations('privacyPage'), getTranslations('nav')])

  return (
    <div>
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
            <p className="mt-4 text-sm font-medium text-ink-soft">{t('hero.updated')}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-14">
          {SECTION_KEYS.map((key, i) => (
            <Reveal key={key} delay={(i % 6) * 60}>
              <h2 className="text-xl font-bold text-navy-900">{t(`sections.${key}.title`)}</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
                {t(`sections.${key}.body`)
                  .split('\n\n')
                  .map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
              </div>
              {key === 'contact' && (
                <Link
                  href="/contact"
                  className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  {tNav('contact')} →
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

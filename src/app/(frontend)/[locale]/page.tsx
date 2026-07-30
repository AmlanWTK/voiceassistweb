import React from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/Reveal'

/**
 * Temporary landing placeholder — proves i18n routing, the language toggle,
 * design tokens, and fonts work end-to-end. Replaced by the real Home page
 * at CP-4.1.
 */
export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations('site')

  const swatches = [
    'bg-sky-bg border-sky-border',
    'bg-mint-bg border-mint-border',
    'bg-peach-bg border-peach-border',
    'bg-lilac-bg border-lilac-border',
    'bg-butter-bg border-butter-border',
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 py-28">
      <Reveal className="text-center max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-mist-green mb-4">
          {t('institution')}
        </p>
        <h1 className="text-5xl font-bold mb-3">{t('name')}</h1>
        <p className="text-2xl text-navy-700 mb-6">{t('tagline')}</p>
        <p className="text-ink-soft leading-relaxed">{t('underConstruction')}</p>
      </Reveal>

      <div className="flex gap-4">
        {swatches.map((s) => (
          <div key={s} className={`h-14 w-14 rounded-2xl border-2 shadow-soft ${s}`} />
        ))}
      </div>

      <a
        href="https://mist.ac.bd"
        className="rounded-btn bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 transition-colors"
      >
        {t('visitMist')}
      </a>
    </div>
  )
}

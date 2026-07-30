import React from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { SectionHeading } from '@/components/ui/SectionHeading'

/** Stub — replaced by the real page in Phase 4. */
export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations('comingSoon')
  const tNav = await getTranslations('nav')

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow={tNav('gallery')} title={t('title')} lede={t('body')} />
    </div>
  )
}

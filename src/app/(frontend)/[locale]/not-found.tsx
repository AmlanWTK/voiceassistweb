import React from 'react'
import { getTranslations } from 'next-intl/server'

import { ButtonLink } from '@/components/ui/Button'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
      <p className="font-heading text-7xl font-bold text-mist-green">404</p>
      <h1 className="mt-4 text-3xl font-bold">{t('title')}</h1>
      <p className="mt-3 text-lg text-ink-soft">{t('body')}</p>
      <ButtonLink href="/" className="mt-8">
        {t('backHome')}
      </ButtonLink>
    </div>
  )
}

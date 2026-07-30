'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'

/**
 * EN ⇄ বাংলা toggle (CP-1.4). Renders both locales; the active one is
 * highlighted, the other links to the same page in the other language.
 */
export function LanguageToggle() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('language')

  const options = [
    { code: 'en' as const, label: t('en') },
    { code: 'bn' as const, label: t('bn') },
  ]

  return (
    <div
      className="inline-flex items-center rounded-full border border-line bg-surface p-1 shadow-soft"
      aria-label={t('label')}
    >
      {options.map(({ code, label }) => {
        const active = code === locale
        return active ? (
          <span
            key={code}
            aria-current="true"
            className="rounded-full bg-navy-900 px-3 py-1 text-sm font-semibold text-surface"
          >
            {label}
          </span>
        ) : (
          <Link
            key={code}
            href={pathname}
            locale={code}
            className="rounded-full px-3 py-1 text-sm font-semibold text-navy-700 transition-colors hover:bg-sky-bg"
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

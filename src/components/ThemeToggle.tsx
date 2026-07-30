'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

/** Light ⇄ dark toggle backed by next-themes. */
export function ThemeToggle() {
  const t = useTranslations('theme')
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // resolvedTheme is unknown until mounted — render a neutral button first
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? t('light') : t('dark')}
      title={dark ? t('light') : t('dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-navy-700 shadow-soft transition-colors hover:bg-sky-bg"
    >
      {dark ? (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  )
}

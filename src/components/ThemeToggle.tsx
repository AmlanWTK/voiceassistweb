'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const isDarkNow = (): boolean => {
  const html = document.documentElement
  if (html.classList.contains('dark')) return true
  if (html.classList.contains('light')) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Light ⇄ dark toggle. The choice is stored in a "theme" cookie; the server
 * renders the matching class on <html> on every subsequent request, and this
 * component flips the class instantly on click. No inline scripts anywhere.
 */
export function ThemeToggle() {
  const t = useTranslations('theme')
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => setDark(isDarkNow()), [])

  const toggle = () => {
    const next = !isDarkNow()
    const html = document.documentElement
    html.classList.toggle('dark', next)
    html.classList.toggle('light', !next)
    document.cookie = `theme=${next ? 'dark' : 'light'};path=/;max-age=31536000;samesite=lax`
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
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

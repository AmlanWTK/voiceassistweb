'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { LanguageToggle } from './LanguageToggle'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/app', key: 'app' },
  { href: '/news', key: 'news' },
  { href: '/gallery', key: 'gallery' },
  { href: '/contact', key: 'contact' },
] as const

export function Header() {
  const t = useTranslations('nav')
  const tSite = useTranslations('site')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
      {/* Skip link — first focusable element on every page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        {t('skipToContent')}
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/icon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
          <span className="font-heading text-lg font-bold text-navy-900">{tSite('name')}</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'rounded-btn px-3 py-2 text-sm font-semibold transition-colors',
                isActive(href)
                  ? 'bg-sky-bg text-navy-900'
                  : 'text-navy-700 hover:bg-sky-bg hover:text-navy-900',
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t('menu')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-line text-navy-900 lg:hidden"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-line bg-surface px-4 pb-6 pt-3 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-btn px-3 py-3 text-base font-semibold',
                    isActive(href) ? 'bg-sky-bg text-navy-900' : 'text-navy-700 hover:bg-sky-bg',
                  )}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  )
}

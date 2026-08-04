import React from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

export async function Footer() {
  const t = await getTranslations('footer')
  const tNav = await getTranslations('nav')
  const tSite = await getTranslations('site')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
            <span className="font-heading text-lg font-bold text-navy-900">{tSite('name')}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">{t('affiliation')}</p>
          <a
            href="https://mist.ac.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-mist-green hover:underline"
          >
            mist.ac.bd →
          </a>
        </div>

        <nav aria-label={t('sitemapLabel')}>
          <h3 className="text-sm font-bold uppercase tracking-widest text-navy-900">
            {t('sitemapLabel')}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {(
              [
                ['/', 'home'],
                ['/about', 'about'],
                ['/journey', 'journey'],
                ['/achievements', 'achievements'],
                ['/app', 'app'],
                ['/news', 'news'],
                ['/gallery', 'gallery'],
                ['/contact', 'contact'],
              ] as const
            ).map(([href, key]) => (
              <li key={key}>
                <Link href={href} className="text-ink-soft hover:text-navy-900 hover:underline">
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-navy-900">
            {t('trustLabel')}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <Link href="/privacy" className="hover:text-navy-900 hover:underline">
                {t('privacy')}
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/AmlanWTK/voiceassistweb"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-navy-900 hover:underline"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-ink-soft">
        © {year} {tSite('name')} · {t('rights')}
      </div>
    </footer>
  )
}

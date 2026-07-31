import React from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'

import { getSiteSettings } from '@/lib/cms-contact'
import type { CmsLocale } from '@/lib/cms'
import { ContactForm } from '@/components/ContactForm'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { Link } from '@/i18n/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'contactPage' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  return { title: `${t('hero.title')} — ${tSite('name')}` }
}

const SOCIAL_ICON: Record<string, React.ReactNode> = {
  facebook: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  youtube: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.4-.4-5a3 3 0 0 0-2.1-2.1C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.5.4A3 3 0 0 0 1.4 7C1 8.6 1 12 1 12s0 3.4.4 5a3 3 0 0 0 2.1 2.1c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4A3 3 0 0 0 22.6 17c.4-1.6.4-5 .4-5ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  ),
  linkedin: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48c0 1.63 1.34 2.98 2.98 2.98h.04c1.64 0 2.98-1.35 2.98-2.98C7.98 4.84 6.62 3.5 4.98 3.5ZM2.4 21.5h5.16V8.98H2.4V21.5ZM15.13 8.65c-2.5 0-4.18 1.37-4.87 2.67h-.07V8.98H5.4V21.5h5.15v-6.98c0-1.84.35-3.63 2.64-3.63 2.25 0 2.28 2.11 2.28 3.75v6.86H20.6v-7.87c0-4.16-2.24-6.11-5.47-6.11Z" />
    </svg>
  ),
  instagram: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.6.07 4.81s-.01 3.56-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.6.07-4.85.07-3.2 0-3.6 0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.16 15.56 2.15 15.2 2.15 12s.01-3.56.07-4.81C2.37 3.96 3.88 2.42 7.14 2.27 8.39 2.21 8.79 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-2.34.1-3.4 1.19-3.5 3.5-.06 1.24-.07 1.6-.07 4.73s.01 3.49.07 4.73c.1 2.32 1.16 3.4 3.5 3.5 1.24.06 1.6.07 4.74.07 3.14 0 3.5-.01 4.74-.07 2.33-.1 3.4-1.18 3.5-3.5.06-1.24.07-1.6.07-4.73s-.01-3.49-.07-4.73c-.1-2.31-1.17-3.4-3.5-3.5A65.7 65.7 0 0 0 12 4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  ),
  x: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 2.5h3.3l-7.2 8.24 8.47 10.76h-6.63l-5.19-6.7-5.94 6.7H1.55l7.7-8.8L1.15 2.5h6.8l4.69 6.13 5.6-6.13Zm-1.16 17.06h1.83L7.03 4.34H5.06l12.02 15.22Z" />
    </svg>
  ),
}

/** CP-4.6 · Contact / Request a Device — localized form (general contact
 *  or device request), plus direct reach-us details from Site Settings. */
export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  setRequestLocale(locale)

  const [t, settings] = await Promise.all([
    getTranslations('contactPage'),
    getSiteSettings(locale as CmsLocale),
  ])

  const socialLinks = settings?.socialLinks || []

  return (
    <div>
      {/* Hero */}
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
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <Card className="p-6 sm:p-8">
              <ContactForm />
            </Card>
          </Reveal>

          <Reveal delay={80} className="space-y-6">
            {(settings?.contactEmail || settings?.phone || settings?.address) && (
              <Card className="p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-mist-green">
                  {t('directContact.eyebrow')}
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {settings?.contactEmail && (
                    <div>
                      <dt className="font-semibold text-navy-900">{t('directContact.emailLabel')}</dt>
                      <dd>
                        <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
                          {settings.contactEmail}
                        </a>
                      </dd>
                    </div>
                  )}
                  {settings?.phone && (
                    <div>
                      <dt className="font-semibold text-navy-900">{t('directContact.phoneLabel')}</dt>
                      <dd>
                        <a href={`tel:${settings.phone}`} className="text-primary hover:underline">
                          {settings.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {settings?.address && (
                    <div>
                      <dt className="font-semibold text-navy-900">{t('directContact.addressLabel')}</dt>
                      <dd className="text-ink-soft">{settings.address}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {socialLinks.length > 0 && (
              <Card className="p-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-mist-green">
                  {t('directContact.followUs')}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id || link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-navy-700 shadow-soft transition-colors hover:bg-sky-bg"
                    >
                      {SOCIAL_ICON[link.platform]}
                    </a>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <p className="text-sm leading-relaxed text-ink-soft">
                {t('directContact.privacyNote')}{' '}
                <Link href="/privacy" className="font-semibold text-primary hover:underline">
                  {t('directContact.privacyLink')}
                </Link>
              </p>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

import React from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Inter, Poppins, Hind_Siliguri, Noto_Sans_Bengali } from 'next/font/google'

import { routing } from '@/i18n/routing'
import { SITE_URL, buildMetadata } from '@/lib/seo'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500'],
  variable: '--font-noto-bengali',
  display: 'swap',
})

const DESCRIPTION = {
  en: 'A free, offline, Bangla-first AAC app that helps special children communicate, learn, and be heard. A project of the Department of Biomedical Engineering, MIST.',
  bn: 'বিশেষ শিশুদের যোগাযোগ, শেখা এবং নিজের কথা প্রকাশ করতে সাহায্য করে এমন একটি বিনামূল্যের, অফলাইন, বাংলা-নির্ভর AAC অ্যাপ। মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজির বায়োমেডিকেল ইঞ্জিনিয়ারিং বিভাগের একটি প্রকল্প।',
}

export const metadataBase = new URL(SITE_URL)

/** Site-wide fallback metadata — every page overrides this via its own
 *  generateMetadata(), but this keeps the root layout itself (and any route
 *  that forgets to set metadata) reasonably correct and localized. */
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const description = locale === 'bn' ? DESCRIPTION.bn : DESCRIPTION.en
  return {
    metadataBase,
    ...buildMetadata({
      locale,
      path: '',
      title: 'Voice Assistant — Giving every child a voice',
      description,
      siteName: 'Voice Assistant',
    }),
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  // Theme: explicit user choice lives in a cookie and is rendered by the
  // server — no client script, no flash. No cookie → CSS media query
  // applies the OS preference (see globals.css).
  const themeCookie = (await cookies()).get('theme')?.value
  const themeClass = themeCookie === 'dark' ? 'dark' : themeCookie === 'light' ? 'light' : ''

  return (
    <html
      lang={locale}
      className={`${themeClass} ${inter.variable} ${poppins.variable} ${hindSiliguri.variable} ${notoSansBengali.variable}`.trim()}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {props.children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

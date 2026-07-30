import React from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Inter, Poppins, Hind_Siliguri, Noto_Sans_Bengali } from 'next/font/google'

import { routing } from '@/i18n/routing'
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

export const metadata = {
  title: 'Voice Assistant — Giving every child a voice',
  description:
    'A free, offline, Bangla-first AAC app that helps special children communicate, learn, and be heard. A project of the Department of Biomedical Engineering, MIST.',
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
          <main>{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

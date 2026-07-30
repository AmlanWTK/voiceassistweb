import React from 'react'
import { Inter, Poppins, Hind_Siliguri, Noto_Sans_Bengali } from 'next/font/google'
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

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${hindSiliguri.variable} ${notoSansBengali.variable}`}
    >
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

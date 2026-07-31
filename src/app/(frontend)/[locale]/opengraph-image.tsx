import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Voice Assistant — Giving every child a voice'

const COPY = {
  en: { name: 'Voice Assistant', tagline: 'Giving every child a voice.', org: 'MIST · Department of Biomedical Engineering' },
  bn: { name: 'ভয়েস অ্যাসিস্ট্যান্ট', tagline: 'প্রতিটি শিশুর কণ্ঠ ফিরিয়ে দিতে।', org: 'মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি (এমআইএসটি)' },
}

/** Default social-share image for every page under a locale, generated at
 *  request time with system fonts only (no external font fetch — keeps this
 *  reliable in any environment, sandboxed or production). Individual pages
 *  (e.g. a news post with a real cover photo) can override this by setting
 *  `openGraph.images` directly in their own generateMetadata(). */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const copy = locale === 'bn' ? COPY.bn : COPY.en

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#1c2a4a',
          padding: '80px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', width: 96, height: 10, backgroundColor: '#1e7a46', marginBottom: 48 }} />
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
          {copy.name}
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#c9d4ad', marginTop: 24 }}>{copy.tagline}</div>
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 56 }}>
          {copy.org}
        </div>
      </div>
    ),
    { ...size },
  )
}

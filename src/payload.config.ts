import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { GalleryAlbums } from './collections/GalleryAlbums'
import { AppReleases } from './collections/AppReleases'
import { TeamMembers } from './collections/TeamMembers'
import { Partners } from './collections/Partners'
import { SuccessStories } from './collections/SuccessStories'
import { Milestones } from './collections/Milestones'
import { Publications } from './collections/Publications'
import { ContactRequests } from './collections/ContactRequests'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** CP-5.4: PAYLOAD_SECRET signs every admin auth JWT — it must never
 *  silently fall back to an empty string. An empty secret is a fixed,
 *  publicly-known value, which would let anyone forge a valid admin
 *  session token. Fail loudly at boot instead of starting up insecure. */
if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    'PAYLOAD_SECRET is not set. Refusing to start with an empty JWT signing secret — ' +
      'set a long, random PAYLOAD_SECRET in your .env before running the app.',
  )
}

/** CP-5.4: with no `csrf` allowlist configured, Payload's own CSRF check
 *  (auth/extractJWT.js) is a no-op — it falls straight through to trusting
 *  the auth cookie regardless of request Origin, leaving only the cookie's
 *  `SameSite: Lax` attribute as protection. Explicitly allowlisting the
 *  real site origin restores Payload's origin check as a second, independent
 *  layer of defense. Kept as a plain string (not the '@/lib/seo' helper) so
 *  this config has no dependency on the Next app tree during Payload boot. */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://voiceassistant.mist.ac.bd').replace(
  /\/$/,
  '',
)

export default buildConfig({
  // Content localization (CP-1.4): every localized field stores EN + BN
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'বাংলা (Bangla)', code: 'bn' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    GalleryAlbums,
    AppReleases,
    TeamMembers,
    Partners,
    SuccessStories,
    Milestones,
    Publications,
    ContactRequests,
  ],
  globals: [HomePage, AboutPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  csrf: [SITE_URL, 'http://localhost:3000'],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  // Email for contact-form notifications — active when SMTP_* env vars are set
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || 'noreply@voiceassistant.local',
          defaultFromName: 'Voice Assist Website',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),
  plugins: [
    // Media files upload to Vercel Blob in production; local disk in dev.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})

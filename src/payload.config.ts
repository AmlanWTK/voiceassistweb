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
  secret: process.env.PAYLOAD_SECRET || '',
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
          defaultFromName: 'Voice Assistant Website',
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

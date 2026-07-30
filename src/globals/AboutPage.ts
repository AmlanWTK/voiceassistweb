import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page Content',
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'story', type: 'richText', localized: true, admin: { description: 'The project story — challenge, motivation, journey.' } },
    { name: 'mission', type: 'richText', localized: true },
    { name: 'acknowledgments', type: 'richText', localized: true },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
  ],
}

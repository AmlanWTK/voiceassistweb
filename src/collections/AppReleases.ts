import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

export const AppReleases: CollectionConfig = {
  slug: 'app-releases',
  labels: { singular: 'App Release', plural: 'App Releases' },
  admin: {
    useAsTitle: 'version',
    defaultColumns: ['version', 'platform', 'releaseDate'],
    description: 'Version history of the Voice Assist app — powers the App Updates feed.',
  },
  defaultSort: '-releaseDate',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'version',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. 1.0.0' },
    },
    {
      name: 'releaseDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      defaultValue: 'android',
      options: [
        { label: 'Android', value: 'android' },
        { label: 'iOS', value: 'ios' },
        { label: 'Windows', value: 'windows' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'changelog',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'
import { slugField } from '../fields/slug'

export const GalleryAlbums: CollectionConfig = {
  slug: 'gallery-albums',
  labels: {
    singular: 'Gallery Album',
    plural: 'Gallery Albums',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', 'displayOrder'],
    description: 'Photo albums and videos from events, workshops, and device handovers.',
  },
  defaultSort: 'displayOrder',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'videoEmbeds',
      type: 'array',
      admin: {
        description: 'YouTube links (use unlisted videos for children, per child-safety policy).',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) =>
            !value || /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(value)
              ? true
              : 'Must be a YouTube URL (https://youtube.com/... or https://youtu.be/...)',
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}

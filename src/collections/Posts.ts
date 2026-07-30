import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'
import { slugField } from '../fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'News Post',
    plural: 'News & Updates',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', '_status'],
    description: 'Handover events, app updates, milestones, and media coverage.',
  },
  versions: {
    drafts: true,
  },
  access: {
    // Public visitors see only published posts; logged-in staff see drafts too.
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
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
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'handover',
      options: [
        { label: 'Handover Event', value: 'handover' },
        { label: 'App Update', value: 'app-update' },
        { label: 'Milestone', value: 'milestone' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short summary shown on listing cards and in social previews (1–2 sentences).',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Optional extra photos shown below the article.',
      },
    },
    {
      name: 'youtubeUrls',
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
      ],
    },
  ],
}

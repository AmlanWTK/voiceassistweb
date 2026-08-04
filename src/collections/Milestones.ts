import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  labels: { singular: 'Milestone', plural: 'Milestones (Timeline)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'date'],
    description: 'The project timeline — research, releases, outreach, and awards.',
  },
  defaultSort: '-date',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'research',
      options: [
        { label: 'Research', value: 'research' },
        { label: 'Release', value: 'release' },
        { label: 'Outreach', value: 'outreach' },
        { label: 'Award', value: 'award' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'awardingBody',
      type: 'text',
      localized: true,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.type === 'award',
        description:
          'Who gave this award, e.g. "ICT Division, Bangladesh". Only shown for Award-type entries — appears alongside this milestone on the Achievements page.',
      },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'

/** Editable content for the homepage — text changes never need a deploy. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page Content',
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'group',
      name: 'hero',
      fields: [
        { name: 'missionStatement', type: 'text', required: true, localized: true },
        { name: 'subtitle', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'ctaLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      admin: {
        description:
          'Impact statistics (animated counters on the homepage). Each stat is 3 separate boxes below — do NOT type "+" into Value or Label, use the Suffix box for that (it gets added automatically after the number).',
      },
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            description: 'Just the number, e.g. 100 — no "+" or other symbols here.',
            placeholder: '100',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description:
              'Optional symbol shown automatically right after the number, e.g. "+" turns "100" into "100+" on the page. Leave blank for an exact number.',
            placeholder: '+',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'What the number counts, e.g. "Devices delivered" — no "+" here either.',
            placeholder: 'Devices delivered',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'whyItMatters',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'richText', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      type: 'group',
      name: 'ourSolution',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'richText', localized: true },
      ],
    },
    {
      type: 'group',
      name: 'featuredVideo',
      fields: [
        { name: 'youtubeUrl', type: 'text' },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
  ],
}

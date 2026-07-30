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
      admin: { description: 'Impact statistics (animated counters on the homepage).' },
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. "+" — shown after the number.' } },
        { name: 'label', type: 'text', required: true, localized: true },
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

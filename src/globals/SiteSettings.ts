import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    { name: 'contactEmail', type: 'email', admin: { description: 'Shown publicly on the contact page.' } },
    { name: 'phone', type: 'text' },
    { name: 'address', type: 'textarea', localized: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X (Twitter)', value: 'x' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

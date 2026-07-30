import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partner', plural: 'Partners & Collaborators' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'displayOrder'],
  },
  defaultSort: 'displayOrder',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'url', type: 'text' },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'institution',
      options: [
        { label: 'Institution', value: 'institution' },
        { label: 'NGO', value: 'ngo' },
        { label: 'Government', value: 'government' },
        { label: 'Sponsor', value: 'sponsor' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication', plural: 'Publications' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'venue', 'year'],
  },
  defaultSort: '-year',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'authors', type: 'text', required: true, admin: { description: 'Comma-separated author list.' } },
    { name: 'venue', type: 'text', admin: { description: 'Journal / conference name.' } },
    { name: 'year', type: 'number', required: true },
    { name: 'link', type: 'text', admin: { description: 'DOI or URL.' } },
  ],
}

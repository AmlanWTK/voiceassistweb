import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

export const SuccessStories: CollectionConfig = {
  slug: 'success-stories',
  labels: { singular: 'Success Story', plural: 'Success Stories' },
  admin: {
    useAsTitle: 'personName',
    defaultColumns: ['personName', 'personRole', 'featured', 'displayOrder'],
    description:
      'Testimonials from parents, teachers, and therapists. Photos of children go through the Media consent safeguard.',
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
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'personName',
      type: 'text',
      required: true,
      admin: {
        description:
          'Child-safety policy: never publish a minor’s full name — use the adult’s name (e.g., a parent) or a first name only.',
      },
    },
    {
      name: 'personRole',
      type: 'select',
      required: true,
      defaultValue: 'parent',
      options: [
        { label: 'Parent', value: 'parent' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Therapist', value: 'therapist' },
        { label: 'School Administrator', value: 'school-admin' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Featured stories appear on the homepage.' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    description:
      'Central media library. Any image or video featuring a child REQUIRES recorded parental/guardian consent before it can be saved.',
  },
  upload: {
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumb',
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Meaningful description for screen readers (required — accessibility by design).',
      },
    },
    {
      name: 'featuresChild',
      type: 'checkbox',
      defaultValue: false,
      label: 'This media features an identifiable child',
      admin: {
        description: 'Tick if any child can be identified in this image.',
      },
    },
    {
      name: 'consentConfirmed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Written parental/guardian consent is on file',
      admin: {
        condition: (data) => Boolean(data?.featuresChild),
        description:
          'Required when the media features a child. Keep the signed consent form in the project records.',
      },
      validate: (value: boolean | null | undefined, { siblingData }: { siblingData: Partial<{ featuresChild?: boolean | null }> }) => {
        if (siblingData?.featuresChild && !value) {
          return 'Child-safety policy: media featuring an identifiable child cannot be saved without confirmed parental/guardian consent.'
        }
        return true
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Optional photographer / source credit.',
      },
    },
  ],
}

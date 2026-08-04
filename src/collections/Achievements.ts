import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '../access'

/** "By the numbers" highlight cards for the public Achievements page —
 *  e.g. "50+ Devices Delivered" with a fuller sentence of context. Shares
 *  its value/suffix/label shape with HomePage's `stats` array on purpose
 *  (same StatTile component, same admin guidance about not typing "+"
 *  into the wrong field) but adds a `description` for more context than
 *  a homepage counter has room for. Awards & recognition live on the
 *  existing Milestones collection (type: 'award') instead of here — an
 *  award is both a dated timeline entry and a spotlight-worthy
 *  achievement, so it isn't duplicated into a second collection. */
export const Achievements: CollectionConfig = {
  slug: 'achievements',
  labels: { singular: 'Achievement', plural: 'Achievements (By the Numbers)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'value', 'suffix', 'displayOrder'],
    description:
      'Highlighted numbers for the public Achievements page (e.g. "50+ Devices Delivered"). For awards/recognition, use the Milestones collection instead — set its Type to "Award".',
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
      admin: { description: 'What the number counts, e.g. "Devices Delivered".' },
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      admin: {
        description: 'Just the number, e.g. 50 — no "+" or other symbols here.',
        placeholder: '50',
      },
    },
    {
      name: 'suffix',
      type: 'text',
      admin: {
        description:
          'Optional symbol shown automatically right after the number, e.g. "+" turns "50" into "50+" on the page. Leave blank for an exact number.',
        placeholder: '+',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'A sentence or two of context — this is what makes it more than just a homepage counter, e.g. "Delivered across 10 partner schools in and around Dhaka since our first handover."',
      },
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Optional — when this milestone was reached, shown under the number if set.',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { adminOnlyField, isAdmin, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    // Only admins can create or delete users and see the full user list;
    // editors can read and update their own account only.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Editors cannot promote themselves or others
        create: adminOnlyField,
        update: adminOnlyField,
      },
      saveToJWT: true,
    },
  ],
}

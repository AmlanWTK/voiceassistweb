import { APIError, type CollectionConfig } from 'payload'

import { adminOnlyField, isAdmin, isAdminOrSelf } from '../access'

/** Payload's own default password rule is only a 3-character minimum —
 *  far too weak for admin/editor accounts that can publish to the public
 *  site and hold contact-form submissions with personal information. This
 *  is not configurable via the `auth` option, so it's enforced with a
 *  beforeChange hook instead (CP-5.4: "admin behind strong passwords"). */
const MIN_PASSWORD_LENGTH = 12

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: {
    // Auth cookie hardening (CP-5.4): Payload's own default is
    // `{ sameSite: 'Lax', secure: false }` — Lax is a fine default (it
    // already blocks the classic cross-site POST/PUT CSRF cases in every
    // modern browser), but `secure: false` would let the session cookie
    // legally travel over a plain-HTTP connection. Since this app is
    // always served over HTTPS in every real deployment (Vercel), mark it
    // Secure there while leaving it off for local http://localhost dev.
    cookies: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // Only admins can create or delete users and see the full user list;
    // editors can read and update their own account only.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (typeof data?.password === 'string' && data.password.length < MIN_PASSWORD_LENGTH) {
          throw new APIError(
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
            400,
          )
        }
        return data
      },
    ],
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

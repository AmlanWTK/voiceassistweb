import type { Access, FieldAccess } from 'payload'

/**
 * Role model (CP-1.3):
 *  - admin:  full control — manages users, settings, and all content
 *  - editor: creates and edits content (posts, media, albums...) but cannot
 *            manage users or change roles
 */

export type Role = 'admin' | 'editor'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'

/** Admins see everyone; other users can only read their own account. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true
  if (user) return { id: { equals: user.id } }
  return false
}

/** Only admins may set or change the role field. */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

/** Anyone (public website visitors) may read. */
export const anyone: Access = () => true

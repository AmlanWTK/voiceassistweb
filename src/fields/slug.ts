import type { Field, FieldHook } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }
    const fallback = data?.[fallbackField] || originalDoc?.[fallbackField]
    // Localized titles arrive as objects during some operations — prefer EN
    const source = typeof fallback === 'object' && fallback !== null ? fallback.en : fallback
    if (typeof source === 'string' && source.length > 0) {
      return slugify(source)
    }
    return value
  }

/** URL slug auto-generated from another field (default: title). */
export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL identifier — auto-generated from the English title; edit only if needed.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
})

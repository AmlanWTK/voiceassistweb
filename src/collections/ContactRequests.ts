import { APIError, type CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'

/** Very small in-memory rate limiter: max N submissions per IP per hour. */
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5
const submissions = new Map<string, number[]>()

const isRateLimited = (ip: string): boolean => {
  const now = Date.now()
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    submissions.set(ip, recent)
    return true
  }
  recent.push(now)
  submissions.set(ip, recent)
  return false
}

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: { singular: 'Contact Request', plural: 'Contact Requests (Inbox)' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'requestType', 'status', 'createdAt'],
    description: 'Messages and device requests from the public contact form.',
  },
  access: {
    create: () => true, // the public form submits here (spam-guarded below)
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (operation !== 'create' || req.user) return data
        // Honeypot: real users never fill the hidden "website" field
        if (data?.website) {
          throw new APIError('Submission could not be processed.', 400)
        }
        const ip =
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          req.headers.get('x-real-ip') ||
          'unknown'
        if (isRateLimited(ip)) {
          throw new APIError('Too many submissions. Please try again later.', 429)
        }
        // Public submissions always start as "new" regardless of payload sent
        return { ...data, status: 'new', website: undefined }
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const to = process.env.CONTACT_NOTIFY_EMAIL
        if (!to) return
        try {
          await req.payload.sendEmail({
            to,
            subject: `[Voice Assist] New ${doc.requestType === 'device-request' ? 'device request' : 'contact message'} from ${doc.name}`,
            text: `Name: ${doc.name}\nOrganization: ${doc.organization || '-'}\nEmail: ${doc.email}\nPhone: ${doc.phone || '-'}\nType: ${doc.requestType}\n\nMessage:\n${doc.message}`,
          })
        } catch (err) {
          req.payload.logger.error({ err }, 'Contact notification email failed')
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'organization', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'requestType',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      options: [
        { label: 'General Contact', value: 'contact' },
        { label: 'Device Request', value: 'device-request' },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'website',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Honeypot — hidden on the public form; bots fill it, humans never see it.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Closed', value: 'closed' },
      ],
      access: {
        // Only staff can change status (public create is forced to "new")
        update: ({ req: { user } }) => Boolean(user),
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNote',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Staff-only notes about this request.' },
    },
  ],
}

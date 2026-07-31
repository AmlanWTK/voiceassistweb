import { getPayload } from 'payload'

import config from '@/payload.config'
import type { CmsLocale } from './cms'

export async function getAboutData(locale: CmsLocale) {
  const payload = await getPayload({ config })

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn()
    } catch {
      return fallback
    }
  }

  const [about, team, milestones] = await Promise.all([
    safe(() => payload.findGlobal({ slug: 'about-page', locale, depth: 1 }), null),
    safe(
      () =>
        payload
          .find({ collection: 'team-members', locale, depth: 1, limit: 20, sort: 'displayOrder' })
          .then((r) => r.docs),
      [],
    ),
    safe(
      () =>
        payload
          .find({ collection: 'milestones', locale, depth: 0, limit: 10, sort: 'date' })
          .then((r) => r.docs),
      [],
    ),
  ])

  return { about, team, milestones }
}

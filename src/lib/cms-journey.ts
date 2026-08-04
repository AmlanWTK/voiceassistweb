import { getPayloadSafe, type CmsLocale } from './cms'

/** Data for the /journey page: the full project timeline (every Milestone,
 *  oldest first), not just the short teaser About shows. */
export async function getJourneyData(locale: CmsLocale) {
  const payload = await getPayloadSafe()
  if (!payload) return { milestones: [] }

  try {
    const milestones = await payload
      .find({ collection: 'milestones', locale, depth: 0, limit: 200, sort: 'date' })
      .then((r) => r.docs)
    return { milestones }
  } catch {
    return { milestones: [] }
  }
}

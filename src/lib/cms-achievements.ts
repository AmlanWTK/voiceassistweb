import { getPayloadSafe, type CmsLocale } from './cms'

/** Data for the /achievements page: "by the numbers" highlight cards plus
 *  awards & recognition (pulled from Milestones where type === 'award',
 *  rather than a second collection — see Achievements.ts's comment). */
export async function getAchievementsData(locale: CmsLocale) {
  const payload = await getPayloadSafe()
  if (!payload) return { achievements: [], awards: [] }

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn()
    } catch {
      return fallback
    }
  }

  const [achievements, awards] = await Promise.all([
    safe(
      () =>
        payload
          .find({ collection: 'achievements', locale, depth: 0, limit: 50, sort: 'displayOrder' })
          .then((r) => r.docs),
      [],
    ),
    safe(
      () =>
        payload
          .find({
            collection: 'milestones',
            locale,
            depth: 0,
            limit: 50,
            sort: '-date',
            where: { type: { equals: 'award' } },
          })
          .then((r) => r.docs),
      [],
    ),
  ])

  return { achievements, awards }
}

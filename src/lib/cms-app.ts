import { getPayloadSafe, type CmsLocale } from './cms'

export async function getAppPageData(locale: CmsLocale) {
  const payload = await getPayloadSafe()
  if (!payload) return { latestRelease: null, outreachMilestones: [] }

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn()
    } catch {
      return fallback
    }
  }

  const [releases, outreachMilestones] = await Promise.all([
    safe(
      () =>
        payload
          .find({ collection: 'app-releases', locale, depth: 0, limit: 1, sort: '-releaseDate' })
          .then((r) => r.docs[0] ?? null),
      null,
    ),
    safe(
      () =>
        payload
          .find({
            collection: 'milestones',
            locale,
            depth: 0,
            limit: 4,
            sort: '-date',
            where: { type: { equals: 'outreach' } },
          })
          .then((r) => r.docs),
      [],
    ),
  ])

  return { latestRelease: releases, outreachMilestones }
}

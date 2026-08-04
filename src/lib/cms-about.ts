import { getPayloadSafe, type CmsLocale } from './cms'

export async function getAboutData(locale: CmsLocale) {
  const payload = await getPayloadSafe()
  if (!payload) return { about: null, team: [], milestones: [] }

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
    // Teaser only — the full timeline lives on its own page (/journey);
    // see cms-journey.ts's getJourneyData for the unlimited version.
    safe(
      () =>
        payload
          .find({ collection: 'milestones', locale, depth: 0, limit: 4, sort: 'date' })
          .then((r) => r.docs),
      [],
    ),
  ])

  return { about, team, milestones }
}

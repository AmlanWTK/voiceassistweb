import { getPayloadSafe, type CmsLocale } from './cms'
import type { SiteSetting } from '@/payload-types'

/** Contact page reach-us info (email, phone, address, social links) —
 *  editable via the Site Settings global. Degrades to null on a connection
 *  failure or empty CMS, same fault-tolerant pattern as the rest of the
 *  site's data fetchers. */
export async function getSiteSettings(locale: CmsLocale): Promise<SiteSetting | null> {
  const payload = await getPayloadSafe()
  if (!payload) return null
  try {
    return await payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })
  } catch {
    return null
  }
}

import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Run on all paths except the Payload admin panel, API routes,
  // Next.js internals, and static files (anything with a dot).
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}

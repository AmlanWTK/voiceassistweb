import React from 'react'

/**
 * Route-level template (not layout.tsx on purpose): Next.js remounts a
 * `template` on every navigation within its segment, unlike `layout`, which
 * persists. That gives every page a fresh, brief fade-in-up on entry instead
 * of an instant hard cut — while Header/Footer in layout.tsx stay mounted
 * and unaffected. Pure CSS (`.page-fade-in` in globals.css), no client JS,
 * and already covered by the site's blanket prefers-reduced-motion override.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade-in">{children}</div>
}

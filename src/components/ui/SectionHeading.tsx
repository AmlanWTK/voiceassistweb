import React from 'react'

import { cn } from '@/lib/utils'

/**
 * Standard section opener: khaki-green eyebrow, large confident heading,
 * optional short lede — per the "premium simplicity" guideline.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: string
  lede?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : '', className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-mist-green">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      {lede && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lede}</p>}
    </div>
  )
}

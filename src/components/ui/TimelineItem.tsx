import React from 'react'

import { Badge } from './Badge'

const typeTone = {
  research: 'sky',
  release: 'mint',
  outreach: 'peach',
  award: 'butter',
} as const

/** One entry on the project timeline. */
export function TimelineItem({
  date,
  title,
  description,
  type,
  typeLabel,
  isLast = false,
}: {
  date: string
  title: string
  description?: string
  type: keyof typeof typeTone
  typeLabel: string
  isLast?: boolean
}) {
  return (
    <li className="relative flex gap-5">
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-mist-green ring-4 ring-mint-bg" />
        {!isLast && <span aria-hidden="true" className="w-px grow bg-line" />}
      </div>
      <div className="pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <time className="text-sm font-semibold text-ink-soft">{date}</time>
          <Badge tone={typeTone[type]}>{typeLabel}</Badge>
        </div>
        <h3 className="mt-1.5 text-lg font-bold">{title}</h3>
        {description && <p className="mt-1 leading-relaxed text-ink-soft">{description}</p>}
      </div>
    </li>
  )
}

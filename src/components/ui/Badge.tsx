import React from 'react'

import { cn } from '@/lib/utils'

type Tone = 'sky' | 'mint' | 'peach' | 'lilac' | 'butter'

const tones: Record<Tone, string> = {
  sky: 'bg-sky-bg border-sky-border',
  mint: 'bg-mint-bg border-mint-border',
  peach: 'bg-peach-bg border-peach-border',
  lilac: 'bg-lilac-bg border-lilac-border',
  butter: 'bg-butter-bg border-butter-border',
}

/** Small category chip — pastel accents per design guidelines. */
export function Badge({
  tone = 'sky',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-navy-900',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

/** Maps post categories to consistent badge tones. */
export const categoryTone: Record<string, Tone> = {
  handover: 'mint',
  'app-update': 'sky',
  milestone: 'butter',
}

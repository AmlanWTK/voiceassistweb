import React from 'react'

import { cn } from '@/lib/utils'

/** Base surface card — 24px radius and soft shadow, matching the app. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface shadow-soft transition-shadow duration-200 hover:shadow-lg',
        className,
      )}
      {...props}
    />
  )
}

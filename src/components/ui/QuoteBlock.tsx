import React from 'react'
import Image from 'next/image'

import { Card } from './Card'

/** Testimonial / success-story quote with dignified presentation. */
export function QuoteBlock({
  quote,
  name,
  role,
  photoUrl,
  photoAlt,
}: {
  quote: string
  name: string
  role: string
  photoUrl?: string
  photoAlt?: string
}) {
  return (
    <Card className="p-8">
      <svg
        aria-hidden="true"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        className="mb-4 fill-mist-green opacity-60"
      >
        <path d="M9.6 4C6 6.2 3.8 9.6 3.8 13.6c0 3 1.8 5 4.3 5 2.2 0 3.9-1.7 3.9-3.9 0-2.1-1.5-3.6-3.5-3.6-.4 0-.9.1-1 .1.3-2.1 2.2-4.6 4.2-5.8L9.6 4Zm9.9 0c-3.5 2.2-5.8 5.6-5.8 9.6 0 3 1.9 5 4.4 5 2.1 0 3.9-1.7 3.9-3.9 0-2.1-1.6-3.6-3.6-3.6-.4 0-.8.1-1 .1.4-2.1 2.3-4.6 4.3-5.8L19.5 4Z" />
      </svg>
      <blockquote className="text-lg leading-relaxed text-ink">{quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {photoUrl && (
          <Image
            src={photoUrl}
            alt={photoAlt || name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border border-line object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-navy-900">{name}</p>
          <p className="text-sm text-ink-soft">{role}</p>
        </div>
      </figcaption>
    </Card>
  )
}

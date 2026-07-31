'use client'

import React, { useEffect, useRef, useState } from 'react'

/** Long text block clamped to a fixed number of lines with a "See more" /
 *  "See less" toggle — the toggle only appears when the text actually
 *  overflows the clamp, so short descriptions render with no button at all. */
export function ClampedText({
  text,
  lines = 5,
  className = '',
  moreLabel,
  lessLabel,
}: {
  text: string
  lines?: number
  className?: string
  moreLabel: string
  lessLabel: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setOverflows(el.scrollHeight - el.clientHeight > 2)
  }, [text])

  return (
    <div>
      <p
        ref={ref}
        style={!expanded ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}
        className={className}
      >
        {text}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  )
}

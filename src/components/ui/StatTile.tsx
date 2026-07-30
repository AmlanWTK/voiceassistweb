'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Impact statistic with a count-up animation on first view (~1s).
 * Respects prefers-reduced-motion: shows the final value immediately.
 */
export function StatTile({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return
          started.current = true
          io.disconnect()
          if (reduced) {
            setDisplay(value)
            return
          }
          const t0 = performance.now()
          const duration = 1000
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1)
            // ease-out cubic
            setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-4xl font-bold text-navy-900 sm:text-5xl">
        {display.toLocaleString()}
        {suffix && <span className="text-mist-green">{suffix}</span>}
      </p>
      <p className="mt-2 text-sm font-medium text-ink-soft">{label}</p>
    </div>
  )
}

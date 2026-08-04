'use client'

import React, { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Fade-in-on-scroll wrapper (≤400ms ease-out, once per element).
 * Fully disabled under prefers-reduced-motion via globals.css.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  children,
}: {
  as?: 'div' | 'section' | 'li' | 'article'
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => el.classList.add('is-visible')

    if (typeof IntersectionObserver === 'undefined') {
      show()
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show()
            io.disconnect()
          }
        })
      },
      // Trigger once the element has actually started entering the
      // viewport (a small negative bottom margin) rather than well before
      // it — so the rise-and-fade is still playing out as it scrolls into
      // view, instead of finishing before the user ever sees it move.
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    // Fail-safe: content must never stay hidden (slow devices, odd
    // scroll containers, print, automation) — force visible after 1.2s
    // once the element is anywhere near the viewport.
    const failSafe = window.setTimeout(show, 1200)
    return () => {
      io.disconnect()
      window.clearTimeout(failSafe)
    }
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

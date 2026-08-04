'use client'

import { useEffect, useRef } from 'react'

/** Elements that should trigger the "hover" (expanded ring) cursor state.
 *  Kept broad but deliberately excludes text-editable fields — those keep
 *  showing the ring too (not the native caret), see globals.css. */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], select, summary, .cursor-hover'

/**
 * Custom "premium" cursor: a small dot glued to the pointer plus a larger
 * ring that eases toward it, expanding over links/buttons. Desktop-only —
 * the effect is a pure enhancement, so it's skipped entirely (no listeners
 * attached, no native cursor hidden) for touch devices and anyone with
 * "reduce motion" set, rather than degraded in place.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // `pointer: fine` reflects the PRIMARY input only, which on some
    // touchscreen laptops (and Windows hybrid devices in particular)
    // reports "coarse" even though a mouse/trackpad is what's actually
    // driving the page. `any-pointer: fine` asks the broader question —
    // is a fine pointer available at all — so those machines still get
    // the effect. The touchstart listener below is the real safety net:
    // if an actual touch ever happens, the cursor is torn down instantly
    // regardless of what the media query said upfront.
    const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!hasFinePointer || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('custom-cursor-active')

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId = 0
    let started = false

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      if (!started) {
        // Snap the ring in on the very first move instead of easing in from
        // the window center, so it doesn't visibly fly across the page.
        started = true
        ringX = mouseX
        ringY = mouseY
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animateRing)
    }

    const handleOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.add('cursor-ring--hover')
        dot.classList.add('cursor-dot--hover')
      }
    }
    const handleOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR)) {
        ring.classList.remove('cursor-ring--hover')
        dot.classList.remove('cursor-dot--hover')
      }
    }

    const handleDown = () => ring.classList.add('cursor-ring--active')
    const handleUp = () => ring.classList.remove('cursor-ring--active')

    const handleLeaveWindow = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    // Real safety net for hybrid touchscreen laptops: the very first actual
    // touch tears the whole effect down immediately, so a finger never gets
    // stuck with an invisible native cursor and a floating dot that doesn't
    // track it.
    const handleFirstTouch = () => {
      document.documentElement.classList.remove('custom-cursor-active')
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow)
      cancelAnimationFrame(rafId)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow)
    window.addEventListener('touchstart', handleFirstTouch, { passive: true, once: true })
    rafId = requestAnimationFrame(animateRing)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow)
      window.removeEventListener('touchstart', handleFirstTouch)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

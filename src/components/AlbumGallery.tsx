'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export type GalleryImage = { id: string | number; url: string; alt: string }

/** Responsive image grid with a keyboard-navigable lightbox — click a photo
 *  to open it full-size, arrow keys / on-screen buttons to move between
 *  photos, Escape or the close button to dismiss. All images passed in have
 *  already been consent-filtered server-side (see consentCleared()).
 *
 *  Focus management (CP-5.2): opening the dialog moves focus to its close
 *  button; Tab is trapped among the dialog's own buttons while it's open;
 *  closing (via Escape, the close button, or the backdrop) returns focus to
 *  whichever thumbnail opened it, so keyboard users never lose their place. */
export function AlbumGallery({ images }: { images: GalleryImage[] }) {
  const t = useTranslations('galleryPage.lightbox')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    triggerRef.current?.focus()
  }, [])
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  )
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    closeBtnRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Tab') {
        // Simple focus trap: cycle Tab/Shift+Tab among the dialog's own
        // focusable buttons instead of letting it escape to the page behind.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, close, prev, next])

  if (images.length === 0) return null

  // Column count adapts to how many photos there actually are, instead of a
  // fixed 4-up grid — a 1- or 2-photo album now fills the space it's given
  // (its container is a 50/50 split with the title/description alongside
  // it) rather than shrinking to one quarter-width cell with empty grid
  // tracks next to it.
  const gridCols =
    images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'

  return (
    <>
      <div className={`grid gap-4 ${gridCols}`}>
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget
              setOpenIndex(i)
            }}
            aria-label={t('open', { alt: img.alt })}
            className="group relative aspect-square overflow-hidden border border-line focus-visible:outline-offset-4"
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 48vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('label')}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label={t('close')}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label={t('prev')}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Intentionally a plain <img>, not next/image: this is the
              full-resolution lightbox view, sized by max-h/max-w against
              each photo's own (unknown-in-advance) aspect ratio — next/image
              needs either fixed dimensions or a pre-sized `fill` container,
              neither of which fits a viewer meant to show the photo at its
              natural proportions. It's also only ever mounted after a click,
              so it never affects initial page-load performance. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[openIndex].url}
            alt={images[openIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[94vh] max-w-full object-contain shadow-soft"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label={t('next')}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}

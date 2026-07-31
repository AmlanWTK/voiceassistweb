import React from 'react'

export type CoverImage = { id: string | number; url: string; alt: string }

/**
 * Modern multi-photo album cover for the gallery listing grid — replaces a
 * single flat "cover image" with a small mosaic so an album's photos are
 * visible at a glance, before the visitor even opens it. Layout adapts to
 * how many consent-cleared photos the album actually has.
 */
export function AlbumCoverMosaic({
  images,
  totalCount,
}: {
  images: CoverImage[]
  totalCount: number
}) {
  if (images.length === 0) {
    return <div className="aspect-[4/3] w-full bg-sky-bg" />
  }

  const tile = (img: CoverImage, className: string, extra?: React.ReactNode) => (
    <div key={img.id} className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {extra}
    </div>
  )

  const hiddenCount = totalCount - 4
  const moreBadge =
    hiddenCount > 0 ? (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
        +{hiddenCount}
      </div>
    ) : undefined

  // Single photo — full-bleed cover.
  if (images.length === 1) {
    return (
      <div className="group aspect-[4/3] w-full">{tile(images[0], 'h-full w-full')}</div>
    )
  }

  // Two photos — even split.
  if (images.length === 2) {
    return (
      <div className="group grid aspect-[4/3] grid-cols-2 gap-0.5">
        {tile(images[0], 'h-full w-full')}
        {tile(images[1], 'h-full w-full')}
      </div>
    )
  }

  // Three photos — one large + two stacked.
  if (images.length === 3) {
    return (
      <div className="group grid aspect-[4/3] grid-cols-2 gap-0.5">
        {tile(images[0], 'h-full w-full row-span-2')}
        <div className="grid grid-rows-2 gap-0.5">
          {tile(images[1], 'h-full w-full')}
          {tile(images[2], 'h-full w-full')}
        </div>
      </div>
    )
  }

  // Four or more — 2x2 grid, "+N" overlay on the last tile when there's more.
  const four = images.slice(0, 4)
  return (
    <div className="group grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-0.5">
      {four.map((img, i) => tile(img, 'h-full w-full', i === 3 ? moreBadge : undefined))}
    </div>
  )
}

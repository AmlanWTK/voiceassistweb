import React from 'react'

export type CoverImage = { id: string | number; url: string; alt: string }

/**
 * Modern album cover for the gallery listing grid: a large hero photo with
 * a thumbnail strip of the next few photos beneath it, and a "+N" badge on
 * the last thumbnail when the album holds more than are shown. Replaces a
 * single flat cover image so an album's photos are visible at a glance,
 * before the visitor even opens it.
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

  const [hero, ...rest] = images
  const thumbs = rest.slice(0, 3)
  const hiddenCount = totalCount - images.length

  return (
    <div className="group">
      <div className="aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.url}
          alt={hero.alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {thumbs.length > 0 && (
        <div
          className="grid gap-0.5 border-t border-line"
          style={{ gridTemplateColumns: `repeat(${thumbs.length}, minmax(0, 1fr))` }}
        >
          {thumbs.map((img, i) => {
            const isLast = i === thumbs.length - 1
            return (
              <div key={img.id} className="relative aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {isLast && hiddenCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white">
                    +{hiddenCount}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

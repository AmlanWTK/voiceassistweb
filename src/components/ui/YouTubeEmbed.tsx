'use client'

import React, { useState } from 'react'

/** Extracts the video id from youtube.com/watch, youtu.be, shorts, embed URLs. */
export const youTubeId = (url: string): string | null => {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m ? m[1] : null
}

/**
 * Lazy YouTube embed: renders only the thumbnail (fast, no layout shift,
 * no third-party scripts) until the visitor presses play.
 */
export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const id = youTubeId(url)
  if (!id) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-img border border-line bg-navy-900">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-soft transition-transform duration-200 group-hover:scale-110">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" className="ml-1 fill-white">
                <path d="M8 5.14v13.72L19 12 8 5.14Z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

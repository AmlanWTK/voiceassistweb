/** Extracts the video id from youtube.com/watch, youtu.be, shorts, embed URLs.
 *  Plain server-safe utility — usable from both Server Components (for
 *  filtering) and the client-only YouTubeEmbed component (for rendering). */
export const youTubeId = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}

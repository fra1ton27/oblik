import type { Media } from '@/payload-types'
import { palette } from '@/styles/palette'

export type ImageDTO = {
  src: string
  width: number
  height: number
  alt: string
  /** data:-URL цвета плейсхолдера (sand по умолчанию) для next/image blur */
  blur: string
}

type SizeName = 'thumb' | 'card' | 'hero' | 'full'

/** Относительный URL: next/image оптимизирует локальные файлы Payload (/api/media/file/**) */
function relative(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url, 'http://local')
    return u.pathname + u.search
  } catch {
    return url
  }
}

const blurCache = new Map<string, string>()
export function blurFor(tone?: string | null): string {
  const key = tone && tone in palette ? tone : 'sand'
  let v = blurCache.get(key)
  if (!v) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10"><rect width="8" height="10" fill="${palette[key as keyof typeof palette]}"/></svg>`
    v = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
    blurCache.set(key, v)
  }
  return v
}

export function toImage(media: unknown, size: SizeName = 'card', fallbackAlt = ''): ImageDTO | null {
  if (!media || typeof media !== 'object') return null
  const m = media as Media
  const s = m.sizes?.[size]
  const src = relative(s?.url) ?? relative(m.url)
  if (!src) return null
  return {
    src,
    width: (s?.url ? s.width : m.width) ?? 1200,
    height: (s?.url ? s.height : m.height) ?? 1500,
    alt: m.alt ?? fallbackAlt,
    blur: blurFor(m.tone),
  }
}

/** Оригинал (для зума и OG): самая большая доступная версия */
export function toLargestImage(media: unknown, fallbackAlt = ''): ImageDTO | null {
  return toImage(media, 'full', fallbackAlt) ?? toImage(media, 'hero', fallbackAlt)
}

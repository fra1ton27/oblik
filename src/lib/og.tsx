/* eslint-disable @next/next/no-img-element -- Satori (next/og) рисует только <img>, next/image здесь неприменим */
import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { palette as c } from '@/styles/palette'
import { site } from '@/config/site'
import { columnPath, terraceColumns, terracePath } from '@/components/shapes/geometry'
import { absoluteUrl } from './paths'
import { relativeUrl } from './media'

/**
 * OG-картинки next/og в фирменном стиле (раздел 13.1 ТЗ): фото на подиуме, название, цена, шейп «терраса».
 * Шрифты — WOFF из @fontsource (Satori не читает WOFF2), скопированы в assets/og вместе с кириллицей
 * и latin-ext для сербских č ć đ š ž; в standalone-сборку попадают через outputFileTracingIncludes.
 */
export const OG_SIZE = { width: 1200, height: 630 }

// Satori берёт первый файл семейства и не перебирает подмножества с тем же именем,
// поэтому каждое подмножество — отдельное семейство, а в стилях — цепочка подстановки
const FONT_FILES = [
  ['Unbounded', 500, 'unbounded-latin-500'],
  ['Unbounded Ext', 500, 'unbounded-latin-ext-500'],
  ['Unbounded Cyr', 500, 'unbounded-cyrillic-500'],
  ['Manrope', 600, 'manrope-latin-600'],
  ['Manrope Ext', 600, 'manrope-latin-ext-600'],
  ['Manrope Cyr', 600, 'manrope-cyrillic-600'],
] as const

const DISPLAY = 'Unbounded, Unbounded Ext, Unbounded Cyr'
const TEXT = 'Manrope, Manrope Ext, Manrope Cyr'

type OgFont = { name: string; data: Buffer; weight: 500 | 600; style: 'normal' }
let fonts: Promise<OgFont[]> | null = null

export function ogFonts(): Promise<OgFont[]> {
  fonts ??= Promise.all(
    FONT_FILES.map(async ([name, weight, file]) => ({
      name,
      weight,
      style: 'normal' as const,
      data: await fs.readFile(path.join(process.cwd(), 'assets', 'og', `${file}-normal.woff`)),
    })),
  )
  return fonts
}

/**
 * Фото для OG как PNG data-URL: файл медиатеки читаем с диска (без HTTP к самому себе),
 * при S3 — по абсолютному адресу. Satori не понимает WebP, поэтому перекодируем через sharp.
 */
export async function ogImage(src: string | null | undefined, size = 640): Promise<string | null> {
  const rel = relativeUrl(src)
  if (!rel) return null
  let buffer: Buffer | null = null
  const local = rel.match(/^\/api\/media\/file\/([^?]+)/)
  if (local) {
    try {
      buffer = await fs.readFile(path.join(process.cwd(), 'media', path.basename(decodeURIComponent(local[1]))))
    } catch {
      buffer = null
    }
  }
  if (!buffer) {
    try {
      const res = await fetch(absoluteUrl(rel))
      if (res.ok) buffer = Buffer.from(await res.arrayBuffer())
    } catch {
      return null
    }
  }
  if (!buffer) return null
  const png = await sharp(buffer).resize(size, size, { fit: 'inside', withoutEnlargement: true }).png().toBuffer()
  return `data:image/png;base64,${png.toString('base64')}`
}

type CardProps = {
  title: string
  subtitle?: string | null
  chip?: string | null
  price?: string | null
  image?: string | null
  /** cutout — вырезка на подиуме, photo — фото в арке */
  imageKind?: 'cutout' | 'photo'
  podium?: string
}

function Mark() {
  const cols = terraceColumns(3, 24, 24)
  return (
    <svg width="44" height="44" viewBox="0 0 28 28">
      <circle cx="7" cy="7" r="4" fill={c['lavender-600']} />
      <g transform="translate(2 2)">
        {cols.map((col, i) => (
          <path key={i} d={columnPath(col.x, col.y, col.width + (i < 2 ? 0.3 : 0), col.height, 2.5, i === 2)} fill={c.ink} />
        ))}
      </g>
    </svg>
  )
}

/** Раскладка 1200 × 630: слева бренд, название, цена; справа подиум с предметом и терраса фоном */
export function OgCard({ title, subtitle, chip, price, image, imageKind = 'cutout', podium = c.lavender }: CardProps) {
  const titleSize = title.length > 34 ? 52 : title.length > 22 ? 62 : 74
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: c.milk, color: c.ink, fontFamily: TEXT }}>
      <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', right: 0, bottom: 0 }}>
        <path d={terracePath(5, 560, 560, 14)} fill={c.sand} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640, padding: '60px 0 60px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: DISPLAY, fontSize: 34, letterSpacing: '-0.02em' }}>
          <Mark />
          {site.name.toLowerCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {chip ? <div style={{ display: 'flex', alignSelf: 'flex-start', background: c.paper, borderRadius: 999, padding: '8px 20px', fontSize: 24 }}>{chip}</div> : null}
          <div style={{ display: 'flex', fontFamily: DISPLAY, fontSize: titleSize, lineHeight: 1.04, letterSpacing: '-0.02em' }}>{title}</div>
          {subtitle ? <div style={{ display: 'flex', fontSize: 28, color: c['ink-soft'], lineHeight: 1.3 }}>{subtitle}</div> : null}
        </div>
        {price ? (
          <div style={{ display: 'flex', alignSelf: 'flex-start', background: c.ink, color: c.milk, borderRadius: 999, padding: '12px 30px', fontFamily: DISPLAY, fontSize: 34 }}>{price}</div>
        ) : (
          <div style={{ display: 'flex', fontSize: 24, color: c['ink-soft'] }}>{site.url.replace(/^https?:\/\//, '')}</div>
        )}
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {imageKind === 'photo' && image ? (
          // фото интерьера в арке
          <div style={{ display: 'flex', width: 400, height: 500, borderRadius: '200px 200px 28px 28px', overflow: 'hidden' }}>
            <img src={image} width={400} height={500} style={{ objectFit: 'cover', width: 400, height: 500 }} alt="" />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 480, height: 520 }}>
            <div style={{ position: 'absolute', bottom: 40, width: 420, height: 120, borderRadius: 999, background: podium }} />
            <div style={{ position: 'absolute', top: 60, width: 380, height: 380, borderRadius: 999, background: c.paper, opacity: 0.6 }} />
            {image ? <img src={image} width={420} height={420} style={{ objectFit: 'contain', width: 420, height: 420, marginBottom: 40 }} alt="" /> : null}
          </div>
        )}
      </div>
    </div>
  )
}

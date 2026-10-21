import 'server-only'
import { UPLOAD_LIMITS } from '@/config/uploads'

export const MAX_FILES = UPLOAD_LIMITS.maxFiles
export const MAX_FILE_SIZE = UPLOAD_LIMITS.maxFileSize
export const MAX_TOTAL_SIZE = UPLOAD_LIMITS.maxTotalSize

export type DetectedType = 'image/jpeg' | 'image/png' | 'image/heic' | 'application/pdf'

/** Определение типа по сигнатуре (magic bytes), а не по расширению или заголовку от клиента */
export function detectMime(buf: Uint8Array): DetectedType | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png'
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return 'application/pdf'
  // HEIC/HEIF: ftyp-бокс со брендом heic/heix/hevc/mif1/msf1
  const ftyp = String.fromCharCode(buf[4], buf[5], buf[6], buf[7])
  const brand = String.fromCharCode(buf[8], buf[9], buf[10], buf[11])
  if (ftyp === 'ftyp' && ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heim', 'heis'].includes(brand)) return 'image/heic'
  return null
}

export function safeFileName(name: string): string {
  const ext = (/\.[a-z0-9]{2,5}$/i.exec(name)?.[0] ?? '').toLowerCase()
  const base = name
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[^\w-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${base || 'file'}-${Date.now().toString(36)}${ext}`
}

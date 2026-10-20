import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
const { detectMime, safeFileName } = await import('@/lib/files')

const bytes = (...b: number[]) => new Uint8Array([...b, ...new Array(16).fill(0)])

describe('проверка файлов по сигнатуре', () => {
  it('распознаёт jpg, png, pdf, heic', () => {
    expect(detectMime(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg')
    expect(detectMime(bytes(0x89, 0x50, 0x4e, 0x47))).toBe('image/png')
    expect(detectMime(bytes(0x25, 0x50, 0x44, 0x46))).toBe('application/pdf')
    const heic = new Uint8Array([0, 0, 0, 24, ...Buffer.from('ftypheic'), 0, 0, 0, 0])
    expect(detectMime(heic)).toBe('image/heic')
  })

  it('отклоняет подделку: exe с расширением .jpg', () => {
    expect(detectMime(bytes(0x4d, 0x5a, 0x90, 0x00))).toBeNull()
  })

  it('безопасное имя файла', () => {
    expect(safeFileName('../../etc/Мой эскиз.PDF')).toMatch(/^[\w-]+-[a-z0-9]+\.pdf$/)
  })
})

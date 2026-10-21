import { afterEach, describe, expect, it, vi } from 'vitest'

async function limits(totalMb?: string) {
  vi.resetModules()
  if (totalMb !== undefined) vi.stubEnv('NEXT_PUBLIC_UPLOAD_TOTAL_MB', totalMb)
  return (await import('@/config/uploads')).UPLOAD_LIMITS
}

describe('лимиты вложений заявки', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('по умолчанию — 5 файлов по 10 МБ (раздел 7 ТЗ)', async () => {
    const l = await limits()
    expect(l).toMatchObject({ maxFiles: 5, maxFileMb: 10, maxTotalMb: 50, totalIsTighter: false })
  })

  it('Netlify: всё вместе до 4 МБ, и подсказка говорит об общем лимите', async () => {
    const l = await limits('4')
    expect(l).toMatchObject({ maxFileMb: 4, maxTotalMb: 4, totalIsTighter: true })
    expect(l.maxTotalSize * 1.34).toBeLessThan(6 * 1024 * 1024) // base64 укладывается в 6 МБ функции
  })
})

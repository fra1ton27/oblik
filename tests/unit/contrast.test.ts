import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrast, parseColorTokens } from '@/lib/contrast'

const tokens = parseColorTokens(readFileSync(path.resolve(import.meta.dirname, '../../src/styles/tokens.css'), 'utf8'))

// Пары «текст / фон» из таблицы 4.1 ТЗ: все должны проходить AA (≥ 4.5:1)
const pairs: Array<[text: string, bg: string]> = [
  ['ink', 'milk'],
  ['ink-soft', 'milk'],
  ['ink-soft', 'lavender'],
  ['milk', 'plum'],
  ['ink', 'lavender'],
  ['lavender-600', 'milk'],
  ['ink', 'pistachio'],
  ['pistachio-700', 'milk'],
  ['ink', 'blush'],
  ['ink', 'mist'],
  ['success', 'milk'],
  ['error', 'milk'],
  ['warning', 'milk'],
  ['ink', 'paper'],
  ['ink-soft', 'paper'],
  ['milk', 'ink'],
  ['ink', 'sand'],
  ['ink-soft', 'sand'],
  ['lavender', 'plum'],
]

describe('палитра: контраст AA', () => {
  it('все токены из ТЗ на месте', () => {
    for (const name of ['milk', 'paper', 'sand', 'line', 'ink', 'ink-soft', 'plum', 'lavender', 'lavender-600', 'pistachio', 'pistachio-700', 'blush', 'mist', 'success', 'error', 'warning']) {
      expect(tokens[name], name).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it.each(pairs)('%s на %s ≥ 4.5', (text, bg) => {
    expect(contrast(tokens[text], tokens[bg])).toBeGreaterThanOrEqual(4.5)
  })
})

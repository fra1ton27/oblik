import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseColorTokens } from '@/lib/contrast'
import { palette } from '@/styles/palette'

describe('palette.ts = tokens.css', () => {
  it('JS-копия цветов совпадает с токенами', () => {
    const tokens = parseColorTokens(readFileSync(path.resolve(import.meta.dirname, '../../src/styles/tokens.css'), 'utf8'))
    for (const [name, hex] of Object.entries(palette)) {
      expect(tokens[name]?.toLowerCase(), name).toBe(hex.toLowerCase())
    }
  })
})

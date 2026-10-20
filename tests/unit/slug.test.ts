import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/slug'

describe('slugify', () => {
  it('русский транслитом', () => {
    expect(slugify('Диван «Облако»')).toBe('divan-oblako')
    expect(slugify('Коллекции')).toBe('kollekcii')
    expect(slugify('Регистрация')).toBe('registraciya')
    expect(slugify('Щедрый ёжик, шкаф')).toBe('shchedryy-ezhik-shkaf')
  })

  it('английский и сербский', () => {
    expect(slugify('Oblako sofa')).toBe('oblako-sofa')
    expect(slugify('Sofa „Oblak”')).toBe('sofa-oblak')
    expect(slugify('Čaša, ćevap, đak, šuma, žuta')).toBe('casa-cevap-djak-suma-zuta')
  })

  it('лишние символы и длина', () => {
    expect(slugify('  Стол & стул — 2 шт.  ')).toBe('stol-and-stul-2-sht')
    expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(80)
  })
})

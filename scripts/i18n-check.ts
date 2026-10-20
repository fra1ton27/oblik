/**
 * pnpm i18n:check — сверяет ключи трёх словарей и падает при расхождении.
 * Дополнительно проверяет:
 *  - пустые строки;
 *  - одинаковый набор ICU-переменных ({name}) в переводах одного ключа;
 *  - сербские строки без кириллицы (sr пишется латиницей);
 *  - наличие обязательных форм плюралов (ru: one/few/many/other, sr: one/few/other).
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const LOCALES = ['ru', 'en', 'sr'] as const
type Dict = { [key: string]: string | Dict }

const root = process.cwd()
const dicts = Object.fromEntries(
  LOCALES.map((l) => [l, JSON.parse(readFileSync(path.join(root, 'messages', `${l}.json`), 'utf8'))]),
) as Record<(typeof LOCALES)[number], Dict>

function flatten(dict: Dict, prefix = ''): Map<string, string> {
  const out = new Map<string, string>()
  for (const [key, value] of Object.entries(dict)) {
    const full = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') out.set(full, value)
    else for (const [k, v] of flatten(value, full)) out.set(k, v)
  }
  return out
}

/** Верхнеуровневые переменные ICU: {name}, {count, plural, ...} → name, count */
function variables(message: string): string[] {
  const vars = new Set<string>()
  const re = /\{\s*([A-Za-z_]\w*)\s*(?=,|\})/g
  for (const match of message.matchAll(re)) {
    const before = message.slice(0, match.index).trimEnd()
    // «one {…}», «=0 {…}» — это ветки плюрала, а не переменные
    if (/(?:^|\s)(?:zero|one|two|few|many|other|=\d+)$/.test(before)) continue
    vars.add(match[1])
  }
  return [...vars].sort()
}

const flat = Object.fromEntries(LOCALES.map((l) => [l, flatten(dicts[l])])) as Record<
  (typeof LOCALES)[number],
  Map<string, string>
>
const errors: string[] = []
const allKeys = new Set(LOCALES.flatMap((l) => [...flat[l].keys()]))

for (const key of [...allKeys].sort()) {
  for (const l of LOCALES) {
    const value = flat[l].get(key)
    if (value === undefined) errors.push(`[${l}] нет ключа: ${key}`)
    else if (value.trim() === '') errors.push(`[${l}] пустая строка: ${key}`)
  }
  const base = flat.ru.get(key)
  if (base === undefined) continue
  const baseVars = variables(base).join(',')
  for (const l of LOCALES) {
    const v = flat[l].get(key)
    if (v !== undefined && variables(v).join(',') !== baseVars) {
      errors.push(`[${l}] переменные не совпадают с ru в ${key}: {${variables(v).join(', ')}} ≠ {${baseVars}}`)
    }
  }
  const sr = flat.sr.get(key)
  if (sr && /[Ѐ-ӿ]/.test(sr)) errors.push(`[sr] кириллица в латинской локали: ${key}`)

  if (/plural,/.test(base)) {
    const need: Record<string, string[]> = { ru: ['one', 'few', 'many', 'other'], sr: ['one', 'few', 'other'], en: ['one', 'other'] }
    for (const l of LOCALES) {
      const v = flat[l].get(key) ?? ''
      for (const form of need[l]) {
        if (!new RegExp(`(^|[\\s,])${form}\\s*\\{`).test(v)) errors.push(`[${l}] нет формы плюрала "${form}" в ${key}`)
      }
    }
  }
}

if (errors.length) {
  console.error(`i18n:check — ошибок: ${errors.length}\n` + errors.map((e) => `  • ${e}`).join('\n'))
  process.exit(1)
}
console.log(`i18n:check — ок: ${allKeys.size} ключей × ${LOCALES.length} языка`)

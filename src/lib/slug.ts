/**
 * Слаги из названия транслитом: диван «Облако» → divan-oblako, sofa «Oblak» → sofa-oblak.
 * Кириллица в URL кодируется и плохо читается, поэтому русские адреса — латиницей.
 */
const RU: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

// Сербская латиница и кириллица
const SR: Record<string, string> = {
  č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'dj', dž: 'dz',
  ђ: 'dj', ј: 'j', љ: 'lj', њ: 'nj', ћ: 'c', џ: 'dz',
}

export function transliterate(input: string): string {
  let out = ''
  for (const ch of input.toLowerCase()) {
    out += RU[ch] ?? SR[ch] ?? ch
  }
  // остальная диакритика латиницы: é → e
  return out.normalize('NFKD').replace(/[̀-ͯ]/g, '')
}

export function slugify(input: string, maxLength = 80): string {
  return transliterate(input)
    .replace(/[«»"'’`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}

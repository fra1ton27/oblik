/**
 * Демо-данные (раздел 12.4 ТЗ): pnpm seed (src/seed/index.ts) или кнопка в админке на Netlify (endpoint.ts).
 * Идемпотентен: записи ищутся по устойчивым ключам (sku, email, код, ключ страницы, русское название)
 * и обновляются, а не дублируются.
 *
 * Переводы: документ создаётся на русском, затем обновляется для en и sr. id строк массивов и блоков
 * переносятся из сохранённого документа, иначе локализованные подполя потерялись бы.
 */
import crypto from 'node:crypto'
import type { Payload } from 'payload'
import { categories, collections, designers, materials, type T3 } from './data/taxonomy'
import { products } from './data/products'
import { customFaq, customSteps, pages, productFaq, productionSteps, reviews } from './data/content'
import { cutoutImage, interiorImage, mapImage, portraitImage, productImage, swatchImage, type FurnitureType } from './images'
import { richText, type RichBlock } from './lexical'
import { palette as P } from '../styles/palette'
import { site } from '../config/site'
import { relativeUrl } from '../lib/media'

type Locale = 'ru' | 'en' | 'sr'
const LOCALES: Locale[] = ['ru', 'en', 'sr']
const OTHER: Locale[] = ['en', 'sr']
const ctx = { skipRevalidate: true, skipRedirect: true, skipEmail: true }
const eur = (n: number) => Math.round(n * 100)

let payload: Payload
let opts: SeedOptions = {}

export type SeedOptions = {
  /** только создавать недостающее: существующие документы не обновляются (seed по частям из админки) */
  createOnly?: boolean
  /** момент (Date.now()), после которого seed останавливается между записями; следующий вызов продолжит */
  deadline?: number
  /** админ уже есть: seed запускает он сам */
  skipAdmin?: boolean
  /** демо-покупатель только из SEED_CUSTOMER_*, без пароля по умолчанию (публичный сайт) */
  customerFromEnvOnly?: boolean
}

export type SeedResult = { done: boolean; seconds: number }

/** Остановка по времени: у функции Netlify 30 с на запрос */
class SeedPaused extends Error {}

function checkpoint() {
  if (opts.deadline && Date.now() > opts.deadline) throw new SeedPaused()
}

/**
 * createOnly: уже созданные записи — одним запросом на коллекцию. Иначе каждый повторный вызов
 * перебирал бы их по одной, и на медленной сети к базе (Netlify → Neon) время уходило бы только на это.
 */
const known = new Map<string, Map<string, number>>()

async function knownIds(collection: 'categories' | 'materials' | 'collections' | 'products' | 'pages' | 'designers', field: string) {
  const cacheKey = `${collection}.${field}`
  let index = known.get(cacheKey)
  if (!index) {
    const res = await payload.find({ collection, locale: 'ru', pagination: false, depth: 0, overrideAccess: true, select: { [field]: true } as never })
    const docs = res.docs as unknown as Array<Record<string, unknown> & { id: number }>
    index = new Map(docs.map((doc) => [String(doc[field]), doc.id]))
    known.set(cacheKey, index)
  }
  return index
}

// ───────── утилиты ─────────

/** Проверка: сербские строки только латиницей */
function assertLatinSr(value: unknown, path = ''): void {
  if (!value || typeof value !== 'object') return
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === 'sr' && typeof v === 'string' && /[Ѐ-ӿ]/.test(v)) throw new Error(`Кириллица в sr: ${path}.${k} — ${v}`)
    assertLatinSr(v, `${path}.${k}`)
  }
}

/** Переносит id строк массивов/блоков из сохранённого документа в данные другой локали */
function withIds<T>(data: T, saved: unknown): T {
  if (Array.isArray(data)) {
    const arr = Array.isArray(saved) ? saved : []
    return data.map((item, i) => {
      const s = arr[i] as Record<string, unknown> | undefined
      const merged = withIds(item, s)
      return s?.id && merged && typeof merged === 'object' && !Array.isArray(merged) ? { ...(merged as object), id: s.id } : merged
    }) as T
  }
  if (data && typeof data === 'object' && !(data instanceof Date)) {
    const out: Record<string, unknown> = {}
    const src = (saved ?? {}) as Record<string, unknown>
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) out[k] = withIds(v, src[k])
    return out as T
  }
  return data
}


/** Создаёт/обновляет локализованный документ: build(locale) возвращает данные для локали */
async function upsertLocalized(
  collection: 'categories' | 'materials' | 'collections' | 'products' | 'pages' | 'designers',
  where: Record<string, unknown>,
  build: (locale: Locale) => Record<string, unknown>,
): Promise<number> {
  checkpoint()
  if (opts.createOnly) {
    const [field, condition] = Object.entries(where)[0] as [string, { equals: unknown }]
    const existing = (await knownIds(collection, field)).get(String(condition.equals))
    const check = localizedField(collection, build('sr'))
    if (existing && !(check && (await incompleteIds(collection, check)).has(existing))) return existing
  }
  const found = await payload.find({ collection, where: where as never, locale: 'ru', limit: 1, depth: 0, overrideAccess: true })
  let id: number
  if (found.docs[0]) {
    id = found.docs[0].id as number
    const saved = await payload.findByID({ collection, id, locale: 'ru', depth: 0, overrideAccess: true })
    await payload.update({ collection, id, locale: 'ru', data: withIds(build('ru'), saved) as never, depth: 0, overrideAccess: true, context: ctx })
  } else {
    const doc = await payload.create({ collection, locale: 'ru', data: build('ru') as never, depth: 0, overrideAccess: true, context: ctx })
    id = doc.id as number
  }
  for (const locale of OTHER) {
    const saved = await payload.findByID({ collection, id, locale: 'ru', depth: 0, overrideAccess: true })
    await payload.update({ collection, id, locale, data: withIds(build(locale), saved) as never, depth: 0, overrideAccess: true, context: ctx })
  }
  return id
}

const mediaCache = new Map<string, number>()

/**
 * createOnly: записи без последней локали (sr). Так бывает, если вызов оборвался между созданием
 * на ru и переводами — такие записи не пропускаем, а дописываем. Один запрос на коллекцию.
 */
const incomplete = new Map<string, Set<number>>()

async function incompleteIds(collection: 'categories' | 'materials' | 'collections' | 'products' | 'pages' | 'designers' | 'media' | 'reviews', field: string) {
  let ids = incomplete.get(collection)
  if (!ids) {
    const res = await payload.find({ collection, locale: 'sr', fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true, select: { [field]: true } as never })
    const docs = res.docs as unknown as Array<Record<string, unknown> & { id: number }>
    ids = new Set(docs.filter((doc) => doc[field] == null || doc[field] === '').map((doc) => doc.id))
    incomplete.set(collection, ids)
  }
  return ids
}

/** Первое локализованное поле из данных сида — по нему видно, дошёл ли перевод до sr */
function localizedField(collection: 'categories' | 'materials' | 'collections' | 'products' | 'pages' | 'designers', data: Record<string, unknown>) {
  const fields = payload.collections[collection].config.flattenedFields
  return Object.keys(data).find((key) => fields.some((f) => f.name === key && 'localized' in f && f.localized))
}

/**
 * Ключ seed → id медиа, одним запросом. Ключ хранится в поле seedKey; у картинок, созданных до него,
 * ищем точное имя файла key.webp / key.jpg / key.png.
 */
async function knownMedia() {
  let index = known.get('media')
  if (!index) {
    const res = await payload.find({ collection: 'media', pagination: false, depth: 0, overrideAccess: true, select: { filename: true, seedKey: true }, sort: 'id' })
    index = new Map()
    for (const doc of res.docs) if (doc.seedKey && !index.has(doc.seedKey)) index.set(doc.seedKey, doc.id as number)
    for (const doc of res.docs) {
      const base = String(doc.filename ?? '').replace(/\.(webp|jpe?g|png)$/i, '')
      if (!doc.seedKey && base && !index.has(base)) index.set(base, doc.id as number)
    }
    known.set('media', index)
  }
  return index
}

async function upsertMedia(key: string, make: () => Promise<Buffer>, alt: T3, tone = 'sand', ext: 'jpg' | 'png' = 'jpg'): Promise<number> {
  if (mediaCache.has(key)) return mediaCache.get(key)!
  checkpoint()
  const index = await knownMedia()
  let id = index.get(key)
  if (id && opts.createOnly && !(await incompleteIds('media', 'alt')).has(id)) {
    mediaCache.set(key, id)
    return id
  }
  if (!id) {
    const data = await make()
    const doc = await payload.create({
      collection: 'media',
      locale: 'ru',
      data: { alt: alt.ru, tone: tone as never, seedKey: key },
      file: { data, mimetype: ext === 'png' ? 'image/png' : 'image/jpeg', name: `${key}.${ext}`, size: data.length },
      overrideAccess: true,
      context: ctx,
    })
    id = doc.id as number
    index.set(key, id)
  }
  for (const locale of LOCALES) {
    await payload.update({ collection: 'media', id, locale, data: { alt: alt[locale] }, depth: 0, overrideAccess: true, context: ctx })
  }
  mediaCache.set(key, id)
  return id
}


// ───────── шаги ─────────

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) throw new Error('SEED_ADMIN_EMAIL и SEED_ADMIN_PASSWORD должны быть заданы в .env')
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  if (!existing.docs[0]) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Admin', role: 'admin' }, overrideAccess: true })
    payload.logger.info(`seed: админ ${email}`)
  }
}

async function seedMaterials() {
  const ids: Record<string, number> = {}
  for (const m of materials) {
    const swatch = await upsertMedia(`material-${m.key}`, () => swatchImage({ kind: m.type, color: m.swatchColor }), m.title)
    ids[m.key] = await upsertLocalized('materials', { title: { equals: m.title.ru } }, (l) => ({
      title: m.title[l],
      key: m.key,
      type: m.type,
      swatchColor: m.swatchColor,
      colorFamily: m.colorFamily,
      swatch,
      macro: swatch,
      origin: m.origin[l],
      description: m.description[l],
      care: m.care[l],
    }))
  }
  return ids
}

async function seedDesigners() {
  const ids: Record<string, number> = {}
  for (const d of designers) {
    const photo = await upsertMedia(`designer-${d.key}`, () => portraitImage({ bg: d.bg, tone: d.tone }), { ru: d.name, en: d.name, sr: d.name })
    ids[d.key] = await upsertLocalized('designers', { key: { equals: d.key } }, (l) => ({
      name: d.name,
      key: d.key,
      role: d.role[l],
      bio: d.bio[l],
      quote: d.quote[l],
      photo,
    }))
  }
  return ids
}

async function seedCategories() {
  const ids: Record<string, number> = {}
  for (const c of categories) {
    const image = await upsertMedia(
      `category-${c.key}`,
      () => productImage({ type: c.icon, colors: { main: P.sand, wood: '#C9A77C', accent: P.blush }, bg: P[c.color], title: c.title.en, view: 0 }),
      c.title,
      c.color,
    )
    ids[c.key] = await upsertLocalized('categories', { title: { equals: c.title.ru } }, (l) => ({
      title: c.title[l],
      description: c.description[l],
      chips: c.chips.map((chip) => ({ label: chip[l] })),
      image,
      color: c.color,
      order: c.order,
    }))
  }
  return ids
}

async function seedCollections() {
  const ids: Record<string, number> = {}
  for (const c of collections) {
    const items = c.products.slice(0, 3).map((key) => products.find((p) => p.key === key)!)
    const hero = await upsertMedia(
      `collection-${c.key}-hero`,
      () => interiorImage({ wall: P[c.podiumColor], floor: '#D9C3A0', items: items.map((p) => ({ type: p.type, colors: p.colors })), seed: c.order, title: c.title.en }),
      { ru: `Коллекция «${c.title.ru}» в интерьере`, en: `${c.title.en} collection in an interior`, sr: `Kolekcija „${c.title.sr}” u enterijeru` },
      c.podiumColor,
    )
    const cutout = await upsertMedia(
      `collection-${c.key}-cutout`,
      () => cutoutImage({ type: items[0].type, colors: items[0].colors, types: items.map((p) => p.type) }),
      { ru: `Комплект «${c.title.ru}»`, en: `${c.title.en} set`, sr: `Komplet „${c.title.sr}”` },
      c.podiumColor,
      'png',
    )
    const gallery: number[] = []
    for (let i = 0; i < 3; i++) {
      const pick = c.products.slice(i, i + 2).map((key) => products.find((p) => p.key === key)!)
      gallery.push(
        await upsertMedia(
          `collection-${c.key}-gallery-${i}`,
          () => interiorImage({ wall: [P.milk, P.sand, P.mist][i], floor: '#CDB48F', items: pick.map((p) => ({ type: p.type, colors: p.colors })), seed: i + c.order }),
          { ru: `Интерьер с коллекцией «${c.title.ru}»`, en: `Interior with the ${c.title.en} collection`, sr: `Enterijer sa kolekcijom „${c.title.sr}”` },
        ),
      )
    }
    ids[c.key] = await upsertLocalized('collections', { title: { equals: c.title.ru } }, (l) => ({
      title: c.title[l],
      slug: c.slugs[l],
      tagline: c.tagline[l],
      room: c.room[l],
      story: c.story[l],
      hero,
      cutout,
      gallery,
      podiumColor: c.podiumColor,
      isBundle: c.isBundle,
      bundleDiscount: c.bundleDiscount,
      status: 'published',
      order: c.order,
    }))
  }
  return ids
}

async function seedProducts(refs: { materials: Record<string, number>; designers: Record<string, number>; categories: Record<string, number>; collections: Record<string, number> }) {
  const ids: Record<string, number> = {}
  for (const p of products) {
    const alt = (suffix: T3): T3 => ({ ru: `${p.title.ru} — ${suffix.ru}`, en: `${p.title.en} — ${suffix.en}`, sr: `${p.title.sr} — ${suffix.sr}` })
    const images: number[] = []
    const views: Array<{ v: 0 | 1 | 2; label: T3 }> = [
      { v: 0, label: { ru: 'общий вид', en: 'front view', sr: 'izgled spreda' } },
      { v: 1, label: { ru: 'ракурс в интерьере', en: 'angled view', sr: 'pogled iz ugla' } },
      { v: 2, label: { ru: 'деталь материала', en: 'material detail', sr: 'detalj materijala' } },
    ]
    for (const { v, label } of views) {
      images.push(await upsertMedia(`product-${p.key}-${v}`, () => productImage({ type: p.type, colors: p.colors, bg: P[p.podiumColor], title: p.model, view: v }), alt(label), p.podiumColor))
    }
    const cutout = await upsertMedia(`product-${p.key}-cutout`, () => cutoutImage({ type: p.type, colors: p.colors }), alt({ ru: 'вырезка', en: 'cut-out', sr: 'izrez' }), p.podiumColor, 'png')
    const sku = `OB-${p.key.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`
    const basePrice = Math.min(...p.variants.map((v) => v.price))
    const stock = p.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)

    ids[p.key] = await upsertLocalized('products', { sku: { equals: sku } }, (l) => ({
      title: p.title[l],
      shortDescription: p.short[l],
      description: richText([{ p: p.description[l] }]),
      sku,
      price: eur(basePrice),
      compareAtPrice: p.compareAt ? eur(p.compareAt) : undefined,
      category: refs.categories[p.category],
      collection: p.collection ? refs.collections[p.collection] : undefined,
      designer: refs.designers[p.designer],
      materials: p.materials.map((m) => refs.materials[m]),
      dimensions: p.dims,
      images: images.map((image) => ({ image })),
      cutout,
      podiumColor: p.podiumColor,
      variantRequired: p.variantRequired ?? true,
      variants: p.variants.map((v) => ({
        sku: `${sku}-${v.sku}`,
        size: v.size?.[l],
        fabric: v.fabric ? refs.materials[v.fabric] : undefined,
        finish: v.finish ? refs.materials[v.finish] : undefined,
        price: eur(v.price),
        stock: v.stock ?? 0,
        leadTimeMin: v.lead?.[0],
        leadTimeMax: v.lead?.[1],
      })),
      stock,
      leadTimeWeeks: { min: p.lead[0], max: p.lead[1] },
      badges: p.badges ?? [],
      featured: Boolean(p.featured),
      popularity: p.popularity,
      status: 'published',
      // OG-картинку по умолчанию рисует opengraph-image.tsx (подиум, цена); своё фото редактор задаёт вручную
      meta: { title: `${p.title[l]} — ${site.name}`, description: p.short[l], image: null },
      faq: [],
    }))
  }
  // состав коллекций
  for (const c of collections) {
    checkpoint()
    if (opts.createOnly) {
      const current = await payload.findByID({ collection: 'collections', id: refs.collections[c.key], depth: 0, overrideAccess: true, select: { products: true } })
      if ((current.products?.length ?? 0) === c.products.length) continue
    }
    await payload.update({
      collection: 'collections',
      id: refs.collections[c.key],
      data: { products: c.products.map((k) => ids[k]) },
      overrideAccess: true,
      context: ctx,
    })
  }
  return ids
}

async function seedReviews(productIds: Record<string, number>) {
  const ids: number[] = []
  const existing = opts.createOnly
    ? new Map((await payload.find({ collection: 'reviews', pagination: false, depth: 0, overrideAccess: true, select: { author: true, product: true } })).docs.map((d) => [`${d.author}|${typeof d.product === 'object' ? d.product?.id : d.product}`, d.id as number]))
    : null
  for (const [i, r] of reviews.entries()) {
    const product = productIds[r.product]
    const p = products.find((x) => x.key === r.product)!
    const photos = r.withPhoto
      ? [
          await upsertMedia(
            `review-${i}`,
            () => interiorImage({ wall: [P.blush, P.mist, P.pistachio, P.lavender][i % 4], floor: '#D2B892', items: [{ type: p.type, colors: p.colors }], seed: i }),
            { ru: `Фото покупателя: ${p.title.ru}`, en: `Customer photo: ${p.title.en}`, sr: `Fotografija kupca: ${p.title.sr}` },
          ),
        ]
      : []
    checkpoint()
    const known = existing?.get(`${r.author}|${product}`)
    if (known && !(await incompleteIds('reviews', 'text')).has(known)) {
      ids.push(known)
      continue
    }
    const found = await payload.find({ collection: 'reviews', where: { and: [{ author: { equals: r.author } }, { product: { equals: product } }] }, limit: 1, overrideAccess: true })
    let id = found.docs[0]?.id as number | undefined
    const base = { product, author: r.author, rating: r.rating, photos, approved: true }
    if (!id) id = (await payload.create({ collection: 'reviews', locale: 'ru', data: { ...base, city: r.city.ru, text: r.text.ru }, overrideAccess: true, context: ctx })).id as number
    for (const l of LOCALES) await payload.update({ collection: 'reviews', id, locale: l, data: { ...base, city: r.city[l], text: r.text[l] }, overrideAccess: true, context: ctx })
    ids.push(id)
  }
  return ids
}

/** Интерьеры клиентов для полотна на главной */
async function seedInteriors() {
  const combos: Array<{ items: string[]; wall: string }> = [
    { items: ['sofa-oblako', 'coffee-krug', 'lamp-luna'], wall: P.lavender },
    { items: ['dining-terasa', 'chair-terasa', 'sideboard-terasa'], wall: P.pistachio },
    { items: ['bed-len', 'nightstand-len', 'mirror-arka'], wall: P.blush },
    { items: ['shelf-lestnica', 'armchair-luk', 'vase-stepenik'], wall: P.mist },
    { items: ['sofa-duna', 'side-kaplya', 'pouf-oblako'], wall: P.sand },
    { items: ['desk-pult', 'barstool-visina', 'cabinet-arka'], wall: P.milk },
    { items: ['armchair-oblako', 'chest-len', 'lamp-luna'], wall: P.lavender },
    { items: ['dining-orbita', 'stool-tochka', 'bench-terasa'], wall: P.pistachio },
  ]
  const ids: number[] = []
  for (const [i, c] of combos.entries()) {
    const items = c.items.map((k) => products.find((p) => p.key === k)!)
    ids.push(
      await upsertMedia(
        `interior-${i}`,
        () => interiorImage({ wall: c.wall, floor: '#D4BC95', items: items.map((p) => ({ type: p.type, colors: p.colors })), seed: i }),
        { ru: `Интерьер клиента: ${items[0].title.ru}`, en: `Customer interior: ${items[0].title.en}`, sr: `Enterijer kupca: ${items[0].title.sr}` },
      ),
    )
  }
  return ids
}

async function seedPages(media: { workshop: number[]; interiors: number[] }) {
  for (const page of pages) {
    const layout = (l: Locale) => {
      if (page.key === 'about')
        return [
          {
            blockType: 'story',
            heading: { ru: 'Начали с одного стула', en: 'It started with a single chair', sr: 'Počeli smo od jedne stolice' }[l],
            text: {
              ru: 'В 2016 году Ана и Марко сделали первый стул для собственной кухни — друзья попросили ещё восемь. Сегодня в цехе на Чукарице работают 24 человека, а каждая вещь по-прежнему проходит через руки дизайнера.',
              en: 'In 2016 Ana and Marko made their first chair for their own kitchen — friends asked for eight more. Today 24 people work in our Čukarica workshop, and every piece still passes through a designer’s hands.',
              sr: 'Ana i Marko su 2016. napravili prvu stolicu za svoju kuhinju — prijatelji su tražili još osam. Danas u radionici na Čukarici radi 24 ljudi, a svaki komad i dalje prolazi kroz ruke dizajnera.',
            }[l],
            quote: designers[0].quote[l],
            quoteAuthor: designers[0].name,
            images: media.workshop,
          },
          {
            blockType: 'stackedCards',
            heading: { ru: 'Как мы делаем мебель', en: 'How we make furniture', sr: 'Kako pravimo nameštaj' }[l],
            source: 'manual',
            cards: productionSteps.map((s, i) => ({ title: s.title[l], text: s.text[l], color: s.color, image: media.workshop[i % media.workshop.length] })),
          },
          {
            blockType: 'stats',
            heading: { ru: 'Цех в цифрах', en: 'The workshop in numbers', sr: 'Radionica u brojkama' }[l],
            items: [
              { value: 1200, suffix: { ru: 'м²', en: 'm²', sr: 'm²' }[l], label: { ru: 'цех и ателье в Белграде', en: 'workshop and studio in Belgrade', sr: 'radionica i atelje u Beogradu' }[l] },
              { value: 24, suffix: '', label: { ru: 'мастера и дизайнеры', en: 'makers and designers', sr: 'majstora i dizajnera' }[l] },
              { value: 3400, suffix: '+', label: { ru: 'предметов в домах клиентов', en: 'pieces in clients’ homes', sr: 'komada u domovima kupaca' }[l] },
            ],
          },
          { blockType: 'gallery', heading: { ru: 'Фото цеха', en: 'Inside the workshop', sr: 'Iz radionice' }[l], images: media.workshop },
          { blockType: 'materials', heading: { ru: 'Материалы', en: 'Materials', sr: 'Materijali' }[l] },
        ]
      if (page.key === 'custom')
        return [
          {
            blockType: 'stackedCards',
            heading: { ru: 'Как проходит работа', en: 'How it works', sr: 'Kako radimo' }[l],
            source: 'manual',
            cards: customSteps.map((s, i) => ({ title: s.title[l], text: s.text[l], color: (['lavender', 'pistachio', 'blush', 'mist', 'sand'] as const)[i] })),
          },
          { blockType: 'gallery', heading: { ru: 'Примеры работ', en: 'Recent commissions', sr: 'Primeri radova' }[l], images: media.interiors.slice(0, 4) },
          { blockType: 'faq', heading: { ru: 'Частые вопросы', en: 'Frequently asked questions', sr: 'Česta pitanja' }[l], items: customFaq.map((f) => ({ question: f.q[l], answer: f.a[l] })) },
        ]
      return []
    }
    const content = (l: Locale) => (page.content ? richText(page.content[l] as RichBlock[]) : undefined)
    checkpoint()
    const done = opts.createOnly ? (await knownIds('pages', 'key')).get(page.key) : undefined
    if (done && !(await incompleteIds('pages', 'title')).has(done)) continue
    const found = await payload.find({ collection: 'pages', where: { key: { equals: page.key } }, limit: 1, overrideAccess: true })
    let id = found.docs[0]?.id as number | undefined
    const heroImage = { about: media.workshop[0], custom: media.interiors[1], contact: media.interiors[2] }[page.key as 'about' | 'custom' | 'contact']
    const build = (l: Locale) => ({ key: page.key, title: page.title[l], intro: page.intro[l], heroImage, content: content(l), layout: layout(l), needsLegalReview: Boolean(page.legal) })
    if (!id) id = (await payload.create({ collection: 'pages', locale: 'ru', data: build('ru') as never, overrideAccess: true, context: ctx })).id as number
    for (const l of LOCALES) {
      const saved = await payload.findByID({ collection: 'pages', id, locale: 'ru', depth: 0, overrideAccess: true })
      await payload.update({ collection: 'pages', id, locale: l, data: withIds(build(l), saved) as never, overrideAccess: true, context: ctx })
    }
  }
}

async function updateGlobalLocalized(slug: 'header' | 'footer' | 'homepage' | 'siteSettings', build: (l: Locale) => Record<string, unknown>) {
  checkpoint()
  // createOnly: глобал уже заполнен, если первое поле есть в последней локали (ru → en → sr)
  if (opts.createOnly) {
    const [first] = Object.keys(build('ru'))
    const current = (await payload.findGlobal({ slug, locale: 'sr', fallbackLocale: false, depth: 0, overrideAccess: true })) as unknown as Record<string, unknown>
    const value = current[first]
    if (Array.isArray(value) ? value.length > 0 : Boolean(value)) return
  }
  await payload.updateGlobal({ slug, locale: 'ru', data: build('ru') as never, overrideAccess: true, context: ctx })
  for (const l of OTHER) {
    const saved = await payload.findGlobal({ slug, locale: 'ru', depth: 0, overrideAccess: true })
    await payload.updateGlobal({ slug, locale: l, data: withIds(build(l), saved) as never, overrideAccess: true, context: ctx })
  }
}

async function seedGlobals(media: { hero: number; interiors: number[]; map: number }, reviewIds: number[], categoryIds: Record<string, number>) {
  const nav = { catalog: { ru: 'Каталог', en: 'Catalogue', sr: 'Katalog' }, collections: { ru: 'Коллекции', en: 'Collections', sr: 'Kolekcije' }, custom: { ru: 'На заказ', en: 'Made to measure', sr: 'Po meri' }, about: { ru: 'О нас', en: 'About', sr: 'O nama' }, contact: { ru: 'Контакты', en: 'Contact', sr: 'Kontakt' } }
  await updateGlobalLocalized('header', (l) => ({
    items: [
      { label: nav.catalog[l], route: '/catalog' },
      { label: nav.collections[l], route: '/collections' },
      { label: nav.custom[l], route: '/custom' },
      { label: nav.about[l], route: '/about' },
      { label: nav.contact[l], route: '/contact' },
    ],
  }))

  await updateGlobalLocalized('footer', (l) => ({
    columns: [
      {
        title: { ru: 'Каталог', en: 'Catalogue', sr: 'Katalog' }[l],
        links: categories.map((c) => ({ label: c.title[l], category: categoryIds[c.key] })),
      },
      {
        title: { ru: 'Покупателям', en: 'Customer care', sr: 'Za kupce' }[l],
        links: [
          { label: { ru: 'Доставка и оплата', en: 'Delivery & payment', sr: 'Dostava i plaćanje' }[l], route: '/delivery' },
          { label: { ru: 'Гарантия', en: 'Warranty', sr: 'Garancija' }[l], route: '/delivery', hash: 'warranty' },
          { label: { ru: 'Уход за мебелью', en: 'Furniture care', sr: 'Održavanje nameštaja' }[l], route: '/delivery', hash: 'care' },
          { label: { ru: 'Вопросы и ответы', en: 'FAQ', sr: 'Pitanja i odgovori' }[l], route: '/delivery', hash: 'faq' },
        ],
      },
      {
        title: { ru: 'Компания', en: 'Company', sr: 'Kompanija' }[l],
        links: [
          { label: { ru: 'О нас', en: 'About us', sr: 'O nama' }[l], route: '/about' },
          { label: { ru: 'Производство', en: 'Our workshop', sr: 'Proizvodnja' }[l], route: '/about', hash: 'production' },
          { label: { ru: 'Мебель на заказ', en: 'Made to measure', sr: 'Nameštaj po meri' }[l], route: '/custom' },
          { label: { ru: 'Контакты и шоурум', en: 'Contact & showroom', sr: 'Kontakt i šou-rum' }[l], route: '/contact' },
        ],
      },
    ],
    socials: [
      { label: 'Instagram', url: site.contacts.instagram },
      { label: 'Telegram', url: site.contacts.telegram },
      { label: 'WhatsApp', url: site.contacts.whatsapp },
      { label: 'Viber', url: site.contacts.viber },
      { label: 'Pinterest', url: site.contacts.pinterest },
    ],
  }))

  await updateGlobalLocalized('siteSettings', (l) => ({
    brandName: site.name,
    phone: site.contacts.phone,
    email: site.contacts.email,
    whatsapp: site.contacts.whatsapp,
    viber: site.contacts.viber,
    telegram: site.contacts.telegram,
    address: { ru: 'Белград, ул. Карађорђева, 42 (Савамала)', en: '42 Karađorđeva St, Savamala, Belgrade', sr: 'Karađorđeva 42, Savamala, Beograd' }[l],
    hours: [
      { days: { ru: 'Пн–Пт', en: 'Mon–Fri', sr: 'Pon–Pet' }[l], time: '10:00–19:00' },
      { days: { ru: 'Сб', en: 'Sat', sr: 'Sub' }[l], time: '11:00–17:00' },
      { days: { ru: 'Вс', en: 'Sun', sr: 'Ned' }[l], time: { ru: 'выходной', en: 'closed', sr: 'zatvoreno' }[l] },
    ],
    openingHoursSpec: 'Mo-Fr 10:00-19:00, Sa 11:00-17:00',
    mapLat: site.contacts.showroom.lat,
    mapLng: site.contacts.showroom.lng,
    mapImage: media.map,
    currency: 'EUR',
    displayCurrency: 'RSD',
    displayRate: 117.2,
    deliveryZones: [
      { code: 'city', price: eur(40), freeFrom: eur(1500), label: { ru: 'Доставка по Белграду', en: 'Belgrade delivery', sr: 'Dostava po Beogradu' }[l], description: { ru: '1–3 дня после готовности, бесплатно от 1 500 €', en: '1–3 days once ready, free over €1,500', sr: '1–3 dana nakon izrade, besplatno od 1.500 €' }[l] },
      { code: 'country', price: eur(90), label: { ru: 'Доставка по Сербии', en: 'Delivery across Serbia', sr: 'Dostava po Srbiji' }[l], description: { ru: '3–5 дней после готовности', en: '3–5 days once ready', sr: '3–5 dana nakon izrade' }[l] },
      { code: 'pickup', price: 0, label: { ru: 'Самовывоз из шоурума', en: 'Showroom pick-up', sr: 'Preuzimanje u šou-rumu' }[l], description: { ru: 'Савамала, Белград', en: 'Savamala, Belgrade', sr: 'Savamala, Beograd' }[l] },
    ],
    liftPrice: eur(20),
    liftPerFloor: eur(8),
    assemblyPrice: eur(45),
    responseTime: { ru: 'в течение 2 часов в рабочее время', en: 'within 2 business hours', sr: 'u roku od 2 sata tokom radnog vremena' }[l],
    managerEmails: process.env.MANAGER_EMAIL ? [{ email: process.env.MANAGER_EMAIL }] : [],
    defaultProductFaq: productFaq.map((f) => ({ question: f.q[l], answer: f.a[l] })),
    maintenance: false,
    maintenanceMessage: { ru: 'Обновляем витрину. Вернёмся через пару часов.', en: 'We are refreshing the showroom. Back in a couple of hours.', sr: 'Osvežavamo izlog. Vraćamo se za par sati.' }[l],
  }))

  await updateGlobalLocalized('homepage', (l) => ({
    layout: [
      {
        blockType: 'hero',
        variant: 'home',
        chip: { ru: 'Новая коллекция «Облако»', en: 'New: the Oblako collection', sr: 'Nova kolekcija „Oblak”' }[l],
        lines: [{ text: { ru: 'Форма', en: 'Form', sr: 'Forma' }[l] }, { text: { ru: 'уюта', en: 'comfort', sr: 'udobnost' }[l] }],
        lead: {
          ru: 'Проектируем и делаем мебель в Белграде: из массива, льна и камня, по вашим размерам.',
          en: 'We design and make furniture in Belgrade — in solid wood, linen and stone, to your measurements.',
          sr: 'Projektujemo i pravimo nameštaj u Beogradu — od masiva, lana i kamena, po vašoj meri.',
        }[l],
        media: media.hero,
        ctaLabel: { ru: 'Смотреть каталог', en: 'Browse the catalogue', sr: 'Pogledaj katalog' }[l],
        ctaRoute: '/catalog',
      },
      { blockType: 'stackedCards', heading: { ru: 'Категории', en: 'Categories', sr: 'Kategorije' }[l], source: 'categories' },
      {
        blockType: 'showcase',
        heading: { ru: 'Комплекты', en: 'Sets', sr: 'Kompleti' }[l],
        lead: { ru: 'Гостиная и столовая целиком — со скидкой комплекта.', en: 'A whole living or dining room — with a set discount.', sr: 'Cela dnevna soba ili trpezarija — uz popust za komplet.' }[l],
        source: 'bundles',
      },
      { blockType: 'productCarousel', heading: { ru: 'Хиты и новинки', en: 'Bestsellers & new', sr: 'Hitovi i novo' }[l], source: 'featured', showFilters: true, limit: 12 },
      {
        blockType: 'stats',
        heading: { ru: 'Производство', en: 'Our workshop', sr: 'Proizvodnja' }[l],
        lead: { ru: 'Свой цех в Белграде: от доски до сборки у вас дома.', en: 'Our own Belgrade workshop: from plank to assembly in your home.', sr: 'Sopstvena radionica u Beogradu: od daske do sklapanja kod vas.' }[l],
        items: [
          { value: 6, suffix: { ru: 'нед.', en: 'wks', sr: 'ned.' }[l], label: { ru: 'средний срок изготовления', en: 'average lead time', sr: 'prosečan rok izrade' }[l] },
          { value: 100, suffix: '%', label: { ru: 'массив и натуральные ткани', en: 'solid wood and natural fabrics', sr: 'masiv i prirodne tkanine' }[l] },
          { value: 10, suffix: { ru: 'лет', en: 'yrs', sr: 'god.' }[l], label: { ru: 'гарантия на каркас', en: 'frame warranty', sr: 'garancija na ram' }[l] },
          { value: 24, suffix: '', label: { ru: 'мастера в цехе', en: 'makers in the workshop', sr: 'majstora u radionici' }[l] },
        ],
        linkLabel: { ru: 'Как мы работаем', en: 'How we work', sr: 'Kako radimo' }[l],
        route: '/about',
      },
      {
        blockType: 'cta',
        variant: 'pistachio',
        heading: { ru: 'Мебель на заказ', en: 'Made to measure', sr: 'Nameštaj po meri' }[l],
        text: { ru: 'Свои размеры, ткань и отделка. Дизайнер свяжется в течение дня.', en: 'Your size, fabric and finish. A designer will be in touch within a day.', sr: 'Vaše mere, tkanina i obrada. Dizajner će vam se javiti u toku dana.' }[l],
        buttonLabel: { ru: 'Обсудить проект', en: 'Discuss a project', sr: 'Razgovarajmo o projektu' }[l],
        action: 'customForm',
        route: '/custom',
      },
      {
        blockType: 'dragCanvas',
        heading: { ru: 'Интерьеры клиентов', en: 'Our clients’ homes', sr: 'Enterijeri naših kupaca' }[l],
        lead: { ru: 'Потяните полотно, чтобы посмотреть, как наша мебель живёт в домах.', en: 'Drag the canvas to see our furniture at home.', sr: 'Prevucite platno i pogledajte kako naš nameštaj živi u domovima.' }[l],
        items: media.interiors.map((image, i) => ({ image, caption: '', review: reviewIds[i] ?? undefined })),
      },
      {
        blockType: 'cta',
        variant: 'plum',
        heading: { ru: 'Давайте обсудим', en: 'Let’s talk', sr: 'Hajde da razgovaramo' }[l],
        text: { ru: 'Напишите нам — подберём модели, ткани и сроки.', en: 'Drop us a line and we’ll suggest models, fabrics and timings.', sr: 'Pišite nam i predložićemo modele, tkanine i rokove.' }[l],
        buttonLabel: { ru: 'Отправить', en: 'Send', sr: 'Pošalji' }[l],
        action: 'contactForm',
      },
    ],
    meta: {
      title: { ru: `${site.name} — дизайнерская мебель из Белграда`, en: `${site.name} — designer furniture from Belgrade`, sr: `${site.name} — dizajnerski nameštaj iz Beograda` }[l],
      description: {
        ru: 'Диваны, столы, стулья, хранение и кровати из массива и натуральных тканей. Делаем по вашим размерам, доставляем по Сербии.',
        en: 'Sofas, tables, chairs, storage and beds in solid wood and natural fabrics. Made to measure, delivered across Serbia.',
        sr: 'Sofe, stolovi, stolice, odlaganje i kreveti od masiva i prirodnih tkanina. Po meri, sa dostavom po Srbiji.',
      }[l],
    },
  }))
}

async function seedPromoCodes() {
  const codes = [
    { code: 'OBLIK10', kind: 'percent', value: 10, minTotal: eur(500) },
    { code: 'WELCOME50', kind: 'amount', value: eur(50), minTotal: eur(1000) },
  ] as const
  for (const c of codes) {
    const found = await payload.find({ collection: 'promoCodes', where: { code: { equals: c.code } }, limit: 1, overrideAccess: true })
    if (!found.docs[0]) await payload.create({ collection: 'promoCodes', data: { ...c, active: true }, overrideAccess: true })
  }
}

async function seedCustomer(productIds: Record<string, number>) {
  if (opts.customerFromEnvOnly && !(process.env.SEED_CUSTOMER_EMAIL && process.env.SEED_CUSTOMER_PASSWORD)) {
    payload.logger.info('seed: демо-покупатель пропущен — задайте SEED_CUSTOMER_EMAIL и SEED_CUSTOMER_PASSWORD')
    return
  }
  checkpoint()
  const email = process.env.SEED_CUSTOMER_EMAIL ?? 'demo@oblik.example'
  const password = process.env.SEED_CUSTOMER_PASSWORD ?? 'demo-password'
  const found = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  const data = {
    email,
    name: 'Ирина Ковач',
    phone: '+381 64 123 4567',
    locale: 'ru' as const,
    newsletter: true,
    favorites: ['sofa-oblako', 'lamp-luna', 'chair-terasa', 'shelf-lestnica'].map((k) => productIds[k]),
    addresses: [
      { label: 'Дом', city: 'Beograd', postalCode: '11000', street: 'Kneza Miloša 12', apartment: '7', floor: 3, elevator: true, isDefault: true },
      { label: 'Дача', city: 'Zemun', postalCode: '11080', street: 'Gospodska 5', floor: 1, elevator: false, isDefault: false },
    ],
  }
  let id = found.docs[0]?.id as number | undefined
  if (!id) {
    id = (await payload.create({ collection: 'customers', data: { ...data, password, _verified: true } as never, overrideAccess: true, disableVerificationEmail: true })).id as number
  } else if (!opts.createOnly) {
    await payload.update({ collection: 'customers', id, data, overrideAccess: true })
  }

  const day = 24 * 60 * 60 * 1000
  const now = Date.now()
  const orders = [
    { key: 'seed-order-1', status: 'delivered', days: 64, items: [['sofa-oblako', 1], ['coffee-krug', 1]] },
    { key: 'seed-order-2', status: 'production', days: 18, items: [['dining-terasa', 1], ['chair-terasa', 4]] },
    { key: 'seed-order-3', status: 'new', days: 1, items: [['lamp-luna', 1]] },
  ] as const
  const flow = ['new', 'confirmed', 'production', 'ready', 'delivered']
  for (const o of orders) {
    const exists = await payload.find({ collection: 'orders', where: { idempotencyKey: { equals: o.key } }, limit: 1, overrideAccess: true })
    if (exists.docs[0]) continue
    const items = await Promise.all(
      o.items.map(async ([key, qty]) => {
        const p = await payload.findByID({ collection: 'products', id: productIds[key], locale: 'ru', depth: 1, overrideAccess: true })
        const v = p.variants?.[0]
        const unit = v?.price ?? p.price
        const img = p.images?.[0]?.image
        return {
          product: p.id,
          title: p.title,
          variantSku: v?.sku,
          variantLabel: [v?.size, typeof v?.fabric === 'object' ? v?.fabric?.title : null, typeof v?.finish === 'object' ? v?.finish?.title : null].filter(Boolean).join(' · '),
          qty,
          unitPrice: unit,
          lineTotal: unit * qty,
          reserved: 0,
          image: typeof img === 'object' ? (relativeUrl(img?.sizes?.thumb?.url ?? img?.url) ?? undefined) : undefined,
          slug: p.slug,
        }
      }),
    )
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)
    const delivery = subtotal >= eur(1500) ? 0 : eur(40)
    const reached = flow.indexOf(o.status)
    const created = now - o.days * day
    await payload.create({
      collection: 'orders',
      data: {
        status: o.status,
        paymentStatus: o.status === 'delivered' ? 'paid' : 'pending',
        paymentMethod: 'manual',
        customer: id,
        contact: { name: data.name, phone: data.phone, email },
        items,
        totals: { subtotal, bundleDiscount: 0, promoDiscount: 0, delivery, services: 0, total: subtotal + delivery, currency: 'EUR' },
        delivery: { method: 'city', city: 'Beograd', postalCode: '11000', street: 'Kneza Miloša 12', apartment: '7', floor: 3, elevator: true, lift: true, assembly: true },
        statusHistory: flow.slice(0, reached + 1).map((s, i) => ({ status: s, at: new Date(created + i * 6 * day).toISOString(), note: '' })),
        locale: 'ru',
        accessToken: crypto.randomBytes(16).toString('hex'),
        idempotencyKey: o.key,
      } as never,
      overrideAccess: true,
      context: ctx,
    })
  }
  // заявки для раздела «Мои заявки»: индивидуальный заказ в работе и закрытый вопрос по товару
  const inquiries = [
    {
      source: 'seed:demo-custom',
      type: 'custom' as const,
      status: 'in_progress' as const,
      data: { furnitureType: 'storage', furnitureTypeLabel: 'Стеллаж в нишу 180 × 40 × 240 см', description: 'Стеллаж в нишу у окна, дуб, закрытые ящики внизу.' },
      product: undefined,
    },
    {
      source: 'seed:demo-question',
      type: 'question' as const,
      status: 'closed' as const,
      data: { question: 'Можно ли заказать «Облако» в ткани заказчика?' },
      product: productIds['sofa-oblako'],
    },
  ]
  for (const q of inquiries) {
    const exists = await payload.find({ collection: 'inquiries', where: { and: [{ sourcePage: { equals: q.source } }, { customer: { equals: id } }] }, limit: 1, overrideAccess: true })
    if (exists.docs.length) continue
    await payload.create({
      collection: 'inquiries',
      data: { type: q.type, status: q.status, name: data.name, email, phone: data.phone, locale: 'ru', sourcePage: q.source, data: q.data, product: q.product, customer: id },
      overrideAccess: true,
      context: ctx,
    })
  }
  payload.logger.info(`seed: демо-покупатель ${email}, 3 заказа и 2 заявки`)
}

export async function runSeed(instance: Payload, options: SeedOptions = {}): Promise<SeedResult> {
  assertLatinSr({ categories, materials, designers, collections, products, reviews, pages, productionSteps, customSteps, customFaq, productFaq })
  payload = instance
  opts = options
  mediaCache.clear()
  known.clear()
  incomplete.clear()
  const t0 = Date.now()
  try {
    await seedSteps()
  } catch (error) {
    if (!(error instanceof SeedPaused)) throw error
    payload.logger.info('seed: пауза по времени, следующий вызов продолжит')
    return { done: false, seconds: Math.round((Date.now() - t0) / 1000) }
  }
  const seconds = Math.round((Date.now() - t0) / 1000)
  payload.logger.info(`seed: готово за ${seconds} с`)
  return { done: true, seconds }
}

async function seedSteps() {
  if (!opts.skipAdmin) await seedAdmin()
  const materialIds = await seedMaterials()
  payload.logger.info('seed: материалы')
  const designerIds = await seedDesigners()
  const categoryIds = await seedCategories()
  payload.logger.info('seed: категории и дизайнеры')
  const collectionIds = await seedCollections()
  payload.logger.info('seed: коллекции')
  const productIds = await seedProducts({ materials: materialIds, designers: designerIds, categories: categoryIds, collections: collectionIds })
  payload.logger.info(`seed: товары (${Object.keys(productIds).length})`)
  const reviewIds = await seedReviews(productIds)
  const interiors = await seedInteriors()
  const workshop: number[] = []
  for (let i = 0; i < 3; i++) {
    const picks = (['shelf-lestnica', 'chair-terasa', 'chest-len'] as const).map((k) => products.find((p) => p.key === k)!)
    workshop.push(
      await upsertMedia(
        `workshop-${i}`,
        () => interiorImage({ wall: [P.sand, P.milk, P.mist][i], floor: '#BFA27A', items: [picks[i], picks[(i + 1) % 3]].map((p) => ({ type: p.type as FurnitureType, colors: p.colors })), seed: i + 5 }),
        { ru: 'Цех Oblik в Белграде', en: 'The Oblik workshop in Belgrade', sr: 'Oblik radionica u Beogradu' },
      ),
    )
  }
  const map = await upsertMedia('showroom-map', () => mapImage(), { ru: 'Карта: шоурум в Савамале', en: 'Map: showroom in Savamala', sr: 'Mapa: šou-rum u Savamali' })
  await seedPages({ workshop, interiors })
  payload.logger.info('seed: страницы')
  await seedGlobals({ hero: interiors[0], interiors, map }, reviewIds, categoryIds)
  await seedPromoCodes()
  await seedCustomer(productIds)
}

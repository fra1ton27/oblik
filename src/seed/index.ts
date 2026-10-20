/**
 * pnpm seed вЂ” РЅР°РїРѕР»РЅСЏРµС‚ Р±Р°Р·Сѓ РґРµРјРѕ-РґР°РЅРЅС‹РјРё (СЂР°Р·РґРµР» 12.4 РўР—). РРґРµРјРїРѕС‚РµРЅС‚РµРЅ: Р·Р°РїРёСЃРё РёС‰СѓС‚СЃСЏ
 * РїРѕ СѓСЃС‚РѕР№С‡РёРІС‹Рј РєР»СЋС‡Р°Рј (sku, email, РєРѕРґ, РєР»СЋС‡ СЃС‚СЂР°РЅРёС†С‹, СЂСѓСЃСЃРєРѕРµ РЅР°Р·РІР°РЅРёРµ) Рё РѕР±РЅРѕРІР»СЏСЋС‚СЃСЏ, Р° РЅРµ РґСѓР±Р»РёСЂСѓСЋС‚СЃСЏ.
 *
 * РџРµСЂРµРІРѕРґС‹: РґРѕРєСѓРјРµРЅС‚ СЃРѕР·РґР°С‘С‚СЃСЏ РЅР° СЂСѓСЃСЃРєРѕРј, Р·Р°С‚РµРј РѕР±РЅРѕРІР»СЏРµС‚СЃСЏ РґР»СЏ en Рё sr. id СЃС‚СЂРѕРє РјР°СЃСЃРёРІРѕРІ Рё Р±Р»РѕРєРѕРІ
 * РїРµСЂРµРЅРѕСЃСЏС‚СЃСЏ РёР· СЃРѕС…СЂР°РЅС‘РЅРЅРѕРіРѕ РґРѕРєСѓРјРµРЅС‚Р°, РёРЅР°С‡Рµ Р»РѕРєР°Р»РёР·РѕРІР°РЅРЅС‹Рµ РїРѕРґРїРѕР»СЏ РїРѕС‚РµСЂСЏР»РёСЃСЊ Р±С‹.
 */
import crypto from 'node:crypto'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { categories, collections, designers, materials, type T3 } from './data/taxonomy'
import { products } from './data/products'
import { customFaq, customSteps, pages, productFaq, productionSteps, reviews } from './data/content'
import { cutoutImage, interiorImage, mapImage, portraitImage, productImage, swatchImage, type FurnitureType } from './images'
import { richText, type RichBlock } from './lexical'
import { palette as P } from '../styles/palette'
import { site } from '../config/site'

type Locale = 'ru' | 'en' | 'sr'
const LOCALES: Locale[] = ['ru', 'en', 'sr']
const OTHER: Locale[] = ['en', 'sr']
const ctx = { skipRevalidate: true, skipRedirect: true, skipEmail: true }
const eur = (n: number) => Math.round(n * 100)

let payload: Payload

// в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ СѓС‚РёР»РёС‚С‹ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

/** РџСЂРѕРІРµСЂРєР°: СЃРµСЂР±СЃРєРёРµ СЃС‚СЂРѕРєРё С‚РѕР»СЊРєРѕ Р»Р°С‚РёРЅРёС†РµР№ */
function assertLatinSr(value: unknown, path = ''): void {
  if (!value || typeof value !== 'object') return
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === 'sr' && typeof v === 'string' && /[РЂ-Уї]/.test(v)) throw new Error(`РљРёСЂРёР»Р»РёС†Р° РІ sr: ${path}.${k} вЂ” ${v}`)
    assertLatinSr(v, `${path}.${k}`)
  }
}

/** РџРµСЂРµРЅРѕСЃРёС‚ id СЃС‚СЂРѕРє РјР°СЃСЃРёРІРѕРІ/Р±Р»РѕРєРѕРІ РёР· СЃРѕС…СЂР°РЅС‘РЅРЅРѕРіРѕ РґРѕРєСѓРјРµРЅС‚Р° РІ РґР°РЅРЅС‹Рµ РґСЂСѓРіРѕР№ Р»РѕРєР°Р»Рё */
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


/** РЎРѕР·РґР°С‘С‚/РѕР±РЅРѕРІР»СЏРµС‚ Р»РѕРєР°Р»РёР·РѕРІР°РЅРЅС‹Р№ РґРѕРєСѓРјРµРЅС‚: build(locale) РІРѕР·РІСЂР°С‰Р°РµС‚ РґР°РЅРЅС‹Рµ РґР»СЏ Р»РѕРєР°Р»Рё */
async function upsertLocalized(
  collection: 'categories' | 'materials' | 'collections' | 'products' | 'pages' | 'designers',
  where: Record<string, unknown>,
  build: (locale: Locale) => Record<string, unknown>,
): Promise<number> {
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

async function upsertMedia(key: string, make: () => Promise<Buffer>, alt: T3, tone = 'sand', ext: 'jpg' | 'png' = 'jpg'): Promise<number> {
  if (mediaCache.has(key)) return mediaCache.get(key)!
  const found = await payload.find({
    collection: 'media',
    where: { filename: { in: [`${key}.webp`, `${key}.${ext}`] } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  let id = found.docs[0]?.id as number | undefined
  if (!id) {
    const data = await make()
    const doc = await payload.create({
      collection: 'media',
      locale: 'ru',
      data: { alt: alt.ru, tone: tone as never },
      file: { data, mimetype: ext === 'png' ? 'image/png' : 'image/jpeg', name: `${key}.${ext}`, size: data.length },
      overrideAccess: true,
      context: ctx,
    })
    id = doc.id as number
  }
  for (const locale of LOCALES) {
    await payload.update({ collection: 'media', id, locale, data: { alt: alt[locale] }, depth: 0, overrideAccess: true, context: ctx })
  }
  mediaCache.set(key, id)
  return id
}


// в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ С€Р°РіРё в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) throw new Error('SEED_ADMIN_EMAIL Рё SEED_ADMIN_PASSWORD РґРѕР»Р¶РЅС‹ Р±С‹С‚СЊ Р·Р°РґР°РЅС‹ РІ .env')
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  if (!existing.docs[0]) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Admin', role: 'admin' }, overrideAccess: true })
    payload.logger.info(`seed: Р°РґРјРёРЅ ${email}`)
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
      { ru: `РљРѕР»Р»РµРєС†РёСЏ В«${c.title.ru}В» РІ РёРЅС‚РµСЂСЊРµСЂРµ`, en: `${c.title.en} collection in an interior`, sr: `Kolekcija вЂћ${c.title.sr}вЂќ u enterijeru` },
      c.podiumColor,
    )
    const cutout = await upsertMedia(
      `collection-${c.key}-cutout`,
      () => cutoutImage({ type: items[0].type, colors: items[0].colors, types: items.map((p) => p.type) }),
      { ru: `РљРѕРјРїР»РµРєС‚ В«${c.title.ru}В»`, en: `${c.title.en} set`, sr: `Komplet вЂћ${c.title.sr}вЂќ` },
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
          { ru: `РРЅС‚РµСЂСЊРµСЂ СЃ РєРѕР»Р»РµРєС†РёРµР№ В«${c.title.ru}В»`, en: `Interior with the ${c.title.en} collection`, sr: `Enterijer sa kolekcijom вЂћ${c.title.sr}вЂќ` },
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
    const alt = (suffix: T3): T3 => ({ ru: `${p.title.ru} вЂ” ${suffix.ru}`, en: `${p.title.en} вЂ” ${suffix.en}`, sr: `${p.title.sr} вЂ” ${suffix.sr}` })
    const images: number[] = []
    const views: Array<{ v: 0 | 1 | 2; label: T3 }> = [
      { v: 0, label: { ru: 'РѕР±С‰РёР№ РІРёРґ', en: 'front view', sr: 'izgled spreda' } },
      { v: 1, label: { ru: 'СЂР°РєСѓСЂСЃ РІ РёРЅС‚РµСЂСЊРµСЂРµ', en: 'angled view', sr: 'pogled iz ugla' } },
      { v: 2, label: { ru: 'РґРµС‚Р°Р»СЊ РјР°С‚РµСЂРёР°Р»Р°', en: 'material detail', sr: 'detalj materijala' } },
    ]
    for (const { v, label } of views) {
      images.push(await upsertMedia(`product-${p.key}-${v}`, () => productImage({ type: p.type, colors: p.colors, bg: P[p.podiumColor], title: p.model, view: v }), alt(label), p.podiumColor))
    }
    const cutout = await upsertMedia(`product-${p.key}-cutout`, () => cutoutImage({ type: p.type, colors: p.colors }), alt({ ru: 'РІС‹СЂРµР·РєР°', en: 'cut-out', sr: 'izrez' }), p.podiumColor, 'png')
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
      meta: { title: `${p.title[l]} вЂ” ${site.name}`, description: p.short[l], image: images[0] },
      faq: [],
    }))
  }
  // СЃРѕСЃС‚Р°РІ РєРѕР»Р»РµРєС†РёР№
  for (const c of collections) {
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
  for (const [i, r] of reviews.entries()) {
    const product = productIds[r.product]
    const p = products.find((x) => x.key === r.product)!
    const photos = r.withPhoto
      ? [
          await upsertMedia(
            `review-${i}`,
            () => interiorImage({ wall: [P.blush, P.mist, P.pistachio, P.lavender][i % 4], floor: '#D2B892', items: [{ type: p.type, colors: p.colors }], seed: i }),
            { ru: `Р¤РѕС‚Рѕ РїРѕРєСѓРїР°С‚РµР»СЏ: ${p.title.ru}`, en: `Customer photo: ${p.title.en}`, sr: `Fotografija kupca: ${p.title.sr}` },
          ),
        ]
      : []
    const found = await payload.find({ collection: 'reviews', where: { and: [{ author: { equals: r.author } }, { product: { equals: product } }] }, limit: 1, overrideAccess: true })
    let id = found.docs[0]?.id as number | undefined
    const base = { product, author: r.author, rating: r.rating, photos, approved: true }
    if (!id) id = (await payload.create({ collection: 'reviews', locale: 'ru', data: { ...base, city: r.city.ru, text: r.text.ru }, overrideAccess: true, context: ctx })).id as number
    for (const l of LOCALES) await payload.update({ collection: 'reviews', id, locale: l, data: { ...base, city: r.city[l], text: r.text[l] }, overrideAccess: true, context: ctx })
    ids.push(id)
  }
  return ids
}

/** РРЅС‚РµСЂСЊРµСЂС‹ РєР»РёРµРЅС‚РѕРІ РґР»СЏ РїРѕР»РѕС‚РЅР° РЅР° РіР»Р°РІРЅРѕР№ */
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
        { ru: `РРЅС‚РµСЂСЊРµСЂ РєР»РёРµРЅС‚Р°: ${items[0].title.ru}`, en: `Customer interior: ${items[0].title.en}`, sr: `Enterijer kupca: ${items[0].title.sr}` },
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
            heading: { ru: 'РќР°С‡Р°Р»Рё СЃ РѕРґРЅРѕРіРѕ СЃС‚СѓР»Р°', en: 'It started with a single chair', sr: 'PoДЌeli smo od jedne stolice' }[l],
            text: {
              ru: 'Р’ 2016 РіРѕРґСѓ РђРЅР° Рё РњР°СЂРєРѕ СЃРґРµР»Р°Р»Рё РїРµСЂРІС‹Р№ СЃС‚СѓР» РґР»СЏ СЃРѕР±СЃС‚РІРµРЅРЅРѕР№ РєСѓС…РЅРё вЂ” РґСЂСѓР·СЊСЏ РїРѕРїСЂРѕСЃРёР»Рё РµС‰С‘ РІРѕСЃРµРјСЊ. РЎРµРіРѕРґРЅСЏ РІ С†РµС…Рµ РЅР° Р§СѓРєР°СЂРёС†Рµ СЂР°Р±РѕС‚Р°СЋС‚ 24 С‡РµР»РѕРІРµРєР°, Р° РєР°Р¶РґР°СЏ РІРµС‰СЊ РїРѕ-РїСЂРµР¶РЅРµРјСѓ РїСЂРѕС…РѕРґРёС‚ С‡РµСЂРµР· СЂСѓРєРё РґРёР·Р°Р№РЅРµСЂР°.',
              en: 'In 2016 Ana and Marko made their first chair for their own kitchen вЂ” friends asked for eight more. Today 24 people work in our ДЊukarica workshop, and every piece still passes through a designerвЂ™s hands.',
              sr: 'Ana i Marko su 2016. napravili prvu stolicu za svoju kuhinju вЂ” prijatelji su traЕѕili joЕЎ osam. Danas u radionici na ДЊukarici radi 24 ljudi, a svaki komad i dalje prolazi kroz ruke dizajnera.',
            }[l],
            quote: designers[0].quote[l],
            quoteAuthor: designers[0].name,
            images: media.workshop,
          },
          {
            blockType: 'stackedCards',
            heading: { ru: 'РљР°Рє РјС‹ РґРµР»Р°РµРј РјРµР±РµР»СЊ', en: 'How we make furniture', sr: 'Kako pravimo nameЕЎtaj' }[l],
            source: 'manual',
            cards: productionSteps.map((s, i) => ({ title: s.title[l], text: s.text[l], color: s.color, image: media.workshop[i % media.workshop.length] })),
          },
          {
            blockType: 'stats',
            heading: { ru: 'Р¦РµС… РІ С†РёС„СЂР°С…', en: 'The workshop in numbers', sr: 'Radionica u brojkama' }[l],
            items: [
              { value: 1200, suffix: { ru: 'РјВІ', en: 'mВІ', sr: 'mВІ' }[l], label: { ru: 'С†РµС… Рё Р°С‚РµР»СЊРµ РІ Р‘РµР»РіСЂР°РґРµ', en: 'workshop and studio in Belgrade', sr: 'radionica i atelje u Beogradu' }[l] },
              { value: 24, suffix: '', label: { ru: 'РјР°СЃС‚РµСЂР° Рё РґРёР·Р°Р№РЅРµСЂС‹', en: 'makers and designers', sr: 'majstora i dizajnera' }[l] },
              { value: 3400, suffix: '+', label: { ru: 'РїСЂРµРґРјРµС‚РѕРІ РІ РґРѕРјР°С… РєР»РёРµРЅС‚РѕРІ', en: 'pieces in clientsвЂ™ homes', sr: 'komada u domovima kupaca' }[l] },
            ],
          },
          { blockType: 'gallery', heading: { ru: 'Р¤РѕС‚Рѕ С†РµС…Р°', en: 'Inside the workshop', sr: 'Iz radionice' }[l], images: media.workshop },
          { blockType: 'materials', heading: { ru: 'РњР°С‚РµСЂРёР°Р»С‹', en: 'Materials', sr: 'Materijali' }[l] },
        ]
      if (page.key === 'custom')
        return [
          {
            blockType: 'stackedCards',
            heading: { ru: 'РљР°Рє РїСЂРѕС…РѕРґРёС‚ СЂР°Р±РѕС‚Р°', en: 'How it works', sr: 'Kako radimo' }[l],
            source: 'manual',
            cards: customSteps.map((s, i) => ({ title: s.title[l], text: s.text[l], color: (['lavender', 'pistachio', 'blush', 'mist', 'sand'] as const)[i] })),
          },
          { blockType: 'gallery', heading: { ru: 'РџСЂРёРјРµСЂС‹ СЂР°Р±РѕС‚', en: 'Recent commissions', sr: 'Primeri radova' }[l], images: media.interiors.slice(0, 4) },
          { blockType: 'faq', heading: { ru: 'Р§Р°СЃС‚С‹Рµ РІРѕРїСЂРѕСЃС‹', en: 'Frequently asked questions', sr: 'ДЊesta pitanja' }[l], items: customFaq.map((f) => ({ question: f.q[l], answer: f.a[l] })) },
        ]
      return []
    }
    const content = (l: Locale) => (page.content ? richText(page.content[l] as RichBlock[]) : undefined)
    const found = await payload.find({ collection: 'pages', where: { key: { equals: page.key } }, limit: 1, overrideAccess: true })
    let id = found.docs[0]?.id as number | undefined
    const build = (l: Locale) => ({ key: page.key, title: page.title[l], intro: page.intro[l], content: content(l), layout: layout(l), needsLegalReview: Boolean(page.legal) })
    if (!id) id = (await payload.create({ collection: 'pages', locale: 'ru', data: build('ru') as never, overrideAccess: true, context: ctx })).id as number
    for (const l of LOCALES) {
      const saved = await payload.findByID({ collection: 'pages', id, locale: 'ru', depth: 0, overrideAccess: true })
      await payload.update({ collection: 'pages', id, locale: l, data: withIds(build(l), saved) as never, overrideAccess: true, context: ctx })
    }
  }
}

async function updateGlobalLocalized(slug: 'header' | 'footer' | 'homepage' | 'siteSettings', build: (l: Locale) => Record<string, unknown>) {
  await payload.updateGlobal({ slug, locale: 'ru', data: build('ru') as never, overrideAccess: true, context: ctx })
  for (const l of OTHER) {
    const saved = await payload.findGlobal({ slug, locale: 'ru', depth: 0, overrideAccess: true })
    await payload.updateGlobal({ slug, locale: l, data: withIds(build(l), saved) as never, overrideAccess: true, context: ctx })
  }
}

async function seedGlobals(media: { hero: number; interiors: number[]; map: number }, reviewIds: number[], categoryIds: Record<string, number>) {
  const nav = { catalog: { ru: 'РљР°С‚Р°Р»РѕРі', en: 'Catalogue', sr: 'Katalog' }, collections: { ru: 'РљРѕР»Р»РµРєС†РёРё', en: 'Collections', sr: 'Kolekcije' }, custom: { ru: 'РќР° Р·Р°РєР°Р·', en: 'Made to measure', sr: 'Po meri' }, about: { ru: 'Рћ РЅР°СЃ', en: 'About', sr: 'O nama' }, contact: { ru: 'РљРѕРЅС‚Р°РєС‚С‹', en: 'Contact', sr: 'Kontakt' } }
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
        title: { ru: 'РљР°С‚Р°Р»РѕРі', en: 'Catalogue', sr: 'Katalog' }[l],
        links: categories.map((c) => ({ label: c.title[l], category: categoryIds[c.key] })),
      },
      {
        title: { ru: 'РџРѕРєСѓРїР°С‚РµР»СЏРј', en: 'Customer care', sr: 'Za kupce' }[l],
        links: [
          { label: { ru: 'Р”РѕСЃС‚Р°РІРєР° Рё РѕРїР»Р°С‚Р°', en: 'Delivery & payment', sr: 'Dostava i plaД‡anje' }[l], route: '/delivery' },
          { label: { ru: 'Р“Р°СЂР°РЅС‚РёСЏ', en: 'Warranty', sr: 'Garancija' }[l], route: '/delivery', hash: 'warranty' },
          { label: { ru: 'РЈС…РѕРґ Р·Р° РјРµР±РµР»СЊСЋ', en: 'Furniture care', sr: 'OdrЕѕavanje nameЕЎtaja' }[l], route: '/delivery', hash: 'care' },
          { label: { ru: 'Р’РѕРїСЂРѕСЃС‹ Рё РѕС‚РІРµС‚С‹', en: 'FAQ', sr: 'Pitanja i odgovori' }[l], route: '/delivery', hash: 'faq' },
        ],
      },
      {
        title: { ru: 'РљРѕРјРїР°РЅРёСЏ', en: 'Company', sr: 'Kompanija' }[l],
        links: [
          { label: { ru: 'Рћ РЅР°СЃ', en: 'About us', sr: 'O nama' }[l], route: '/about' },
          { label: { ru: 'РџСЂРѕРёР·РІРѕРґСЃС‚РІРѕ', en: 'Our workshop', sr: 'Proizvodnja' }[l], route: '/about', hash: 'production' },
          { label: { ru: 'РњРµР±РµР»СЊ РЅР° Р·Р°РєР°Р·', en: 'Made to measure', sr: 'NameЕЎtaj po meri' }[l], route: '/custom' },
          { label: { ru: 'РљРѕРЅС‚Р°РєС‚С‹ Рё С€РѕСѓСЂСѓРј', en: 'Contact & showroom', sr: 'Kontakt i ЕЎou-rum' }[l], route: '/contact' },
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
    address: { ru: 'Р‘РµР»РіСЂР°Рґ, СѓР». РљР°СЂР°С’РѕСЂС’РµРІР°, 42 (РЎР°РІР°РјР°Р»Р°)', en: '42 KaraД‘orД‘eva St, Savamala, Belgrade', sr: 'KaraД‘orД‘eva 42, Savamala, Beograd' }[l],
    hours: [
      { days: { ru: 'РџРЅвЂ“РџС‚', en: 'MonвЂ“Fri', sr: 'PonвЂ“Pet' }[l], time: '10:00вЂ“19:00' },
      { days: { ru: 'РЎР±', en: 'Sat', sr: 'Sub' }[l], time: '11:00вЂ“17:00' },
      { days: { ru: 'Р’СЃ', en: 'Sun', sr: 'Ned' }[l], time: { ru: 'РІС‹С…РѕРґРЅРѕР№', en: 'closed', sr: 'zatvoreno' }[l] },
    ],
    mapLat: site.contacts.showroom.lat,
    mapLng: site.contacts.showroom.lng,
    mapImage: media.map,
    currency: 'EUR',
    displayCurrency: 'RSD',
    displayRate: 117.2,
    deliveryZones: [
      { code: 'city', price: eur(40), freeFrom: eur(1500), label: { ru: 'Р”РѕСЃС‚Р°РІРєР° РїРѕ Р‘РµР»РіСЂР°РґСѓ', en: 'Belgrade delivery', sr: 'Dostava po Beogradu' }[l], description: { ru: '1вЂ“3 РґРЅСЏ РїРѕСЃР»Рµ РіРѕС‚РѕРІРЅРѕСЃС‚Рё, Р±РµСЃРїР»Р°С‚РЅРѕ РѕС‚ 1 500 в‚¬', en: '1вЂ“3 days once ready, free over в‚¬1,500', sr: '1вЂ“3 dana nakon izrade, besplatno od 1.500 в‚¬' }[l] },
      { code: 'country', price: eur(90), label: { ru: 'Р”РѕСЃС‚Р°РІРєР° РїРѕ РЎРµСЂР±РёРё', en: 'Delivery across Serbia', sr: 'Dostava po Srbiji' }[l], description: { ru: '3вЂ“5 РґРЅРµР№ РїРѕСЃР»Рµ РіРѕС‚РѕРІРЅРѕСЃС‚Рё', en: '3вЂ“5 days once ready', sr: '3вЂ“5 dana nakon izrade' }[l] },
      { code: 'pickup', price: 0, label: { ru: 'РЎР°РјРѕРІС‹РІРѕР· РёР· С€РѕСѓСЂСѓРјР°', en: 'Showroom pick-up', sr: 'Preuzimanje u ЕЎou-rumu' }[l], description: { ru: 'РЎР°РІР°РјР°Р»Р°, Р‘РµР»РіСЂР°Рґ', en: 'Savamala, Belgrade', sr: 'Savamala, Beograd' }[l] },
    ],
    liftPrice: eur(20),
    liftPerFloor: eur(8),
    assemblyPrice: eur(45),
    responseTime: { ru: 'РІ С‚РµС‡РµРЅРёРµ 2 С‡Р°СЃРѕРІ РІ СЂР°Р±РѕС‡РµРµ РІСЂРµРјСЏ', en: 'within 2 business hours', sr: 'u roku od 2 sata tokom radnog vremena' }[l],
    managerEmails: process.env.MANAGER_EMAIL ? [{ email: process.env.MANAGER_EMAIL }] : [],
    defaultProductFaq: productFaq.map((f) => ({ question: f.q[l], answer: f.a[l] })),
    maintenance: false,
    maintenanceMessage: { ru: 'РћР±РЅРѕРІР»СЏРµРј РІРёС‚СЂРёРЅСѓ. Р’РµСЂРЅС‘РјСЃСЏ С‡РµСЂРµР· РїР°СЂСѓ С‡Р°СЃРѕРІ.', en: 'We are refreshing the showroom. Back in a couple of hours.', sr: 'OsveЕѕavamo izlog. VraД‡amo se za par sati.' }[l],
  }))

  await updateGlobalLocalized('homepage', (l) => ({
    layout: [
      {
        blockType: 'hero',
        variant: 'home',
        chip: { ru: 'РќРѕРІР°СЏ РєРѕР»Р»РµРєС†РёСЏ В«РћР±Р»Р°РєРѕВ»', en: 'New: the Oblako collection', sr: 'Nova kolekcija вЂћOblakвЂќ' }[l],
        lines: [{ text: { ru: 'Р¤РѕСЂРјР°', en: 'Form', sr: 'Forma' }[l] }, { text: { ru: 'СѓСЋС‚Р°', en: 'comfort', sr: 'udobnost' }[l] }],
        lead: {
          ru: 'РџСЂРѕРµРєС‚РёСЂСѓРµРј Рё РґРµР»Р°РµРј РјРµР±РµР»СЊ РІ Р‘РµР»РіСЂР°РґРµ: РёР· РјР°СЃСЃРёРІР°, Р»СЊРЅР° Рё РєР°РјРЅСЏ, РїРѕ РІР°С€РёРј СЂР°Р·РјРµСЂР°Рј.',
          en: 'We design and make furniture in Belgrade вЂ” in solid wood, linen and stone, to your measurements.',
          sr: 'Projektujemo i pravimo nameЕЎtaj u Beogradu вЂ” od masiva, lana i kamena, po vaЕЎoj meri.',
        }[l],
        media: media.hero,
        ctaLabel: { ru: 'РЎРјРѕС‚СЂРµС‚СЊ РєР°С‚Р°Р»РѕРі', en: 'Browse the catalogue', sr: 'Pogledaj katalog' }[l],
        ctaRoute: '/catalog',
      },
      { blockType: 'stackedCards', heading: { ru: 'РљР°С‚РµРіРѕСЂРёРё', en: 'Categories', sr: 'Kategorije' }[l], source: 'categories' },
      {
        blockType: 'showcase',
        heading: { ru: 'РљРѕРјРїР»РµРєС‚С‹', en: 'Sets', sr: 'Kompleti' }[l],
        lead: { ru: 'Р“РѕСЃС‚РёРЅР°СЏ Рё СЃС‚РѕР»РѕРІР°СЏ С†РµР»РёРєРѕРј вЂ” СЃРѕ СЃРєРёРґРєРѕР№ РєРѕРјРїР»РµРєС‚Р°.', en: 'A whole living or dining room вЂ” with a set discount.', sr: 'Cela dnevna soba ili trpezarija вЂ” uz popust za komplet.' }[l],
        source: 'bundles',
      },
      { blockType: 'productCarousel', heading: { ru: 'РҐРёС‚С‹ Рё РЅРѕРІРёРЅРєРё', en: 'Bestsellers & new', sr: 'Hitovi i novo' }[l], source: 'featured', showFilters: true, limit: 12 },
      {
        blockType: 'stats',
        heading: { ru: 'РџСЂРѕРёР·РІРѕРґСЃС‚РІРѕ', en: 'Our workshop', sr: 'Proizvodnja' }[l],
        lead: { ru: 'РЎРІРѕР№ С†РµС… РІ Р‘РµР»РіСЂР°РґРµ: РѕС‚ РґРѕСЃРєРё РґРѕ СЃР±РѕСЂРєРё Сѓ РІР°СЃ РґРѕРјР°.', en: 'Our own Belgrade workshop: from plank to assembly in your home.', sr: 'Sopstvena radionica u Beogradu: od daske do sklapanja kod vas.' }[l],
        items: [
          { value: 6, suffix: { ru: 'РЅРµРґ.', en: 'wks', sr: 'ned.' }[l], label: { ru: 'СЃСЂРµРґРЅРёР№ СЃСЂРѕРє РёР·РіРѕС‚РѕРІР»РµРЅРёСЏ', en: 'average lead time', sr: 'proseДЌan rok izrade' }[l] },
          { value: 100, suffix: '%', label: { ru: 'РјР°СЃСЃРёРІ Рё РЅР°С‚СѓСЂР°Р»СЊРЅС‹Рµ С‚РєР°РЅРё', en: 'solid wood and natural fabrics', sr: 'masiv i prirodne tkanine' }[l] },
          { value: 10, suffix: { ru: 'Р»РµС‚', en: 'yrs', sr: 'god.' }[l], label: { ru: 'РіР°СЂР°РЅС‚РёСЏ РЅР° РєР°СЂРєР°СЃ', en: 'frame warranty', sr: 'garancija na ram' }[l] },
          { value: 24, suffix: '', label: { ru: 'РјР°СЃС‚РµСЂР° РІ С†РµС…Рµ', en: 'makers in the workshop', sr: 'majstora u radionici' }[l] },
        ],
        linkLabel: { ru: 'РљР°Рє РјС‹ СЂР°Р±РѕС‚Р°РµРј', en: 'How we work', sr: 'Kako radimo' }[l],
        route: '/about',
      },
      {
        blockType: 'cta',
        variant: 'pistachio',
        heading: { ru: 'РњРµР±РµР»СЊ РЅР° Р·Р°РєР°Р·', en: 'Made to measure', sr: 'NameЕЎtaj po meri' }[l],
        text: { ru: 'РЎРІРѕРё СЂР°Р·РјРµСЂС‹, С‚РєР°РЅСЊ Рё РѕС‚РґРµР»РєР°. Р”РёР·Р°Р№РЅРµСЂ СЃРІСЏР¶РµС‚СЃСЏ РІ С‚РµС‡РµРЅРёРµ РґРЅСЏ.', en: 'Your size, fabric and finish. A designer will be in touch within a day.', sr: 'VaЕЎe mere, tkanina i obrada. Dizajner Д‡e vam se javiti u toku dana.' }[l],
        buttonLabel: { ru: 'РћР±СЃСѓРґРёС‚СЊ РїСЂРѕРµРєС‚', en: 'Discuss a project', sr: 'Razgovarajmo o projektu' }[l],
        action: 'customForm',
        route: '/custom',
      },
      {
        blockType: 'dragCanvas',
        heading: { ru: 'РРЅС‚РµСЂСЊРµСЂС‹ РєР»РёРµРЅС‚РѕРІ', en: 'Our clientsвЂ™ homes', sr: 'Enterijeri naЕЎih kupaca' }[l],
        lead: { ru: 'РџРѕС‚СЏРЅРёС‚Рµ РїРѕР»РѕС‚РЅРѕ, С‡С‚РѕР±С‹ РїРѕСЃРјРѕС‚СЂРµС‚СЊ, РєР°Рє РЅР°С€Р° РјРµР±РµР»СЊ Р¶РёРІС‘С‚ РІ РґРѕРјР°С….', en: 'Drag the canvas to see our furniture at home.', sr: 'Prevucite platno i pogledajte kako naЕЎ nameЕЎtaj Еѕivi u domovima.' }[l],
        items: media.interiors.map((image, i) => ({ image, caption: '', review: reviewIds[i] ?? undefined })),
      },
      {
        blockType: 'cta',
        variant: 'plum',
        heading: { ru: 'Р”Р°РІР°Р№С‚Рµ РѕР±СЃСѓРґРёРј РІР°С€ РёРЅС‚РµСЂСЊРµСЂ', en: 'LetвЂ™s talk about your space', sr: 'Razgovarajmo o vaЕЎem prostoru' }[l],
        text: { ru: 'РќР°РїРёС€РёС‚Рµ РЅР°Рј вЂ” РїРѕРґР±РµСЂС‘Рј РјРѕРґРµР»Рё, С‚РєР°РЅРё Рё СЃСЂРѕРєРё.', en: 'Drop us a line and weвЂ™ll suggest models, fabrics and timings.', sr: 'PiЕЎite nam i predloЕѕiД‡emo modele, tkanine i rokove.' }[l],
        buttonLabel: { ru: 'РћС‚РїСЂР°РІРёС‚СЊ', en: 'Send', sr: 'PoЕЎalji' }[l],
        action: 'contactForm',
      },
    ],
    meta: {
      title: { ru: `${site.name} вЂ” РґРёР·Р°Р№РЅРµСЂСЃРєР°СЏ РјРµР±РµР»СЊ РёР· Р‘РµР»РіСЂР°РґР°`, en: `${site.name} вЂ” designer furniture from Belgrade`, sr: `${site.name} вЂ” dizajnerski nameЕЎtaj iz Beograda` }[l],
      description: {
        ru: 'Р”РёРІР°РЅС‹, СЃС‚РѕР»С‹, СЃС‚СѓР»СЊСЏ, С…СЂР°РЅРµРЅРёРµ Рё РєСЂРѕРІР°С‚Рё РёР· РјР°СЃСЃРёРІР° Рё РЅР°С‚СѓСЂР°Р»СЊРЅС‹С… С‚РєР°РЅРµР№. Р”РµР»Р°РµРј РїРѕ РІР°С€РёРј СЂР°Р·РјРµСЂР°Рј, РґРѕСЃС‚Р°РІР»СЏРµРј РїРѕ РЎРµСЂР±РёРё.',
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
  const email = process.env.SEED_CUSTOMER_EMAIL ?? 'demo@oblik.example'
  const password = process.env.SEED_CUSTOMER_PASSWORD ?? 'demo-password'
  const found = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  const data = {
    email,
    name: 'РСЂРёРЅР° РљРѕРІР°С‡',
    phone: '+381 64 123 4567',
    locale: 'ru' as const,
    newsletter: true,
    favorites: ['sofa-oblako', 'lamp-luna', 'chair-terasa', 'shelf-lestnica'].map((k) => productIds[k]),
    addresses: [
      { label: 'Р”РѕРј', city: 'Beograd', postalCode: '11000', street: 'Kneza MiloЕЎa 12', apartment: '7', floor: 3, elevator: true, isDefault: true },
      { label: 'Р”Р°С‡Р°', city: 'Zemun', postalCode: '11080', street: 'Gospodska 5', floor: 1, elevator: false, isDefault: false },
    ],
  }
  let id = found.docs[0]?.id as number | undefined
  if (!id) {
    id = (await payload.create({ collection: 'customers', data: { ...data, password, _verified: true } as never, overrideAccess: true, disableVerificationEmail: true })).id as number
  } else {
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
          variantLabel: [v?.size, typeof v?.fabric === 'object' ? v?.fabric?.title : null, typeof v?.finish === 'object' ? v?.finish?.title : null].filter(Boolean).join(' В· '),
          qty,
          unitPrice: unit,
          lineTotal: unit * qty,
          reserved: 0,
          image: typeof img === 'object' ? (img?.sizes?.thumb?.url ?? img?.url) : undefined,
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
        delivery: { method: 'city', city: 'Beograd', postalCode: '11000', street: 'Kneza MiloЕЎa 12', apartment: '7', floor: 3, elevator: true, lift: true, assembly: true },
        statusHistory: flow.slice(0, reached + 1).map((s, i) => ({ status: s, at: new Date(created + i * 6 * day).toISOString(), note: '' })),
        locale: 'ru',
        accessToken: crypto.randomBytes(16).toString('hex'),
        idempotencyKey: o.key,
      } as never,
      overrideAccess: true,
      context: ctx,
    })
  }
  payload.logger.info(`seed: РґРµРјРѕ-РїРѕРєСѓРїР°С‚РµР»СЊ ${email} Рё 3 Р·Р°РєР°Р·Р°`)
}

async function seed() {
  assertLatinSr({ categories, materials, designers, collections, products, reviews, pages, productionSteps, customSteps, customFaq, productFaq })
  payload = await getPayload({ config })
  const t0 = Date.now()
  await seedAdmin()
  const materialIds = await seedMaterials()
  payload.logger.info('seed: РјР°С‚РµСЂРёР°Р»С‹')
  const designerIds = await seedDesigners()
  const categoryIds = await seedCategories()
  payload.logger.info('seed: РєР°С‚РµРіРѕСЂРёРё Рё РґРёР·Р°Р№РЅРµСЂС‹')
  const collectionIds = await seedCollections()
  payload.logger.info('seed: РєРѕР»Р»РµРєС†РёРё')
  const productIds = await seedProducts({ materials: materialIds, designers: designerIds, categories: categoryIds, collections: collectionIds })
  payload.logger.info(`seed: С‚РѕРІР°СЂС‹ (${Object.keys(productIds).length})`)
  const reviewIds = await seedReviews(productIds)
  const interiors = await seedInteriors()
  const workshop: number[] = []
  for (let i = 0; i < 3; i++) {
    const picks = (['shelf-lestnica', 'chair-terasa', 'chest-len'] as const).map((k) => products.find((p) => p.key === k)!)
    workshop.push(
      await upsertMedia(
        `workshop-${i}`,
        () => interiorImage({ wall: [P.sand, P.milk, P.mist][i], floor: '#BFA27A', items: [picks[i], picks[(i + 1) % 3]].map((p) => ({ type: p.type as FurnitureType, colors: p.colors })), seed: i + 5 }),
        { ru: 'Р¦РµС… Oblik РІ Р‘РµР»РіСЂР°РґРµ', en: 'The Oblik workshop in Belgrade', sr: 'Oblik radionica u Beogradu' },
      ),
    )
  }
  const map = await upsertMedia('showroom-map', () => mapImage(), { ru: 'РљР°СЂС‚Р°: С€РѕСѓСЂСѓРј РІ РЎР°РІР°РјР°Р»Рµ', en: 'Map: showroom in Savamala', sr: 'Mapa: ЕЎou-rum u Savamali' })
  await seedPages({ workshop, interiors })
  payload.logger.info('seed: СЃС‚СЂР°РЅРёС†С‹')
  await seedGlobals({ hero: interiors[0], interiors, map }, reviewIds, categoryIds)
  await seedPromoCodes()
  await seedCustomer(productIds)
  payload.logger.info(`seed: РіРѕС‚РѕРІРѕ Р·Р° ${Math.round((Date.now() - t0) / 1000)} СЃ`)
}

// `payload run` РёРјРїРѕСЂС‚РёСЂСѓРµС‚ РјРѕРґСѓР»СЊ Рё СЃСЂР°Р·Сѓ Р·Р°РІРµСЂС€Р°РµС‚ РїСЂРѕС†РµСЃСЃ, РїРѕСЌС‚РѕРјСѓ Р¶РґС‘Рј С‡РµСЂРµР· top-level await
try {
  await seed()
} catch (error) {
  const details = (error as { data?: { errors?: unknown } })?.data?.errors
  if (details) console.error('validation errors:', JSON.stringify(details, null, 2))
  console.error(error)
  process.exit(1)
}

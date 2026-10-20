/**
 * Пастельные плейсхолдеры для демо-данных: сгенерированы локально через sharp из SVG,
 * чтобы не зависеть от сети и чужих лицензий. Реальные фото загружаются потом через админку.
 */
import sharp from 'sharp'
import { palette as P } from '../styles/palette'

export type FurnitureType =
  | 'sofa'
  | 'armchair'
  | 'pouf'
  | 'coffee'
  | 'side'
  | 'dining'
  | 'round'
  | 'desk'
  | 'chair'
  | 'stool'
  | 'barstool'
  | 'bench'
  | 'shelf'
  | 'sideboard'
  | 'chest'
  | 'cabinet'
  | 'bed'
  | 'nightstand'
  | 'lamp'
  | 'mirror'
  | 'vase'

export type Colors = { main: string; wood: string; accent?: string }

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c: number) => Math.max(0, Math.min(255, Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)))
  const r = mix((n >> 16) & 255)
  const g = mix((n >> 8) & 255)
  const b = mix(n & 255)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const rect = (x: number, y: number, w: number, h: number, rx: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`
const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, opacity = 1) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`

/** Силуэт мебели в системе координат 1000 × 1000, пол на y = 860 */
export function furniture(type: FurnitureType, c: Colors): string {
  const main = c.main
  const dark = shade(main, -0.14)
  const light = shade(main, 0.18)
  const wood = c.wood
  const woodDark = shade(wood, -0.22)
  const shadow = ellipse(500, 862, 380, 26, P.ink, 0.12)
  const legs = (xs: number[], top: number, h = 860 - top, w = 18) => xs.map((x) => rect(x - w / 2, top, w, h, 6, woodDark)).join('')

  switch (type) {
    case 'sofa':
      return [
        shadow,
        legs([200, 800], 780, 80),
        rect(150, 420, 700, 220, 70, dark),
        rect(120, 520, 120, 270, 56, main),
        rect(760, 520, 120, 270, 56, main),
        rect(200, 600, 600, 190, 40, main),
        rect(215, 585, 282, 70, 34, light),
        rect(503, 585, 282, 70, 34, light),
        rect(230, 450, 250, 160, 60, light),
        rect(520, 450, 250, 160, 60, light),
      ].join('')
    case 'armchair':
      return [
        ellipse(500, 862, 240, 22, P.ink, 0.12),
        legs([330, 670], 790, 70),
        rect(300, 400, 400, 260, 90, dark),
        rect(270, 540, 110, 260, 52, main),
        rect(620, 540, 110, 260, 52, main),
        rect(330, 610, 340, 190, 40, main),
        rect(345, 590, 310, 80, 36, light),
      ].join('')
    case 'pouf':
      return [ellipse(500, 862, 220, 20, P.ink, 0.12), rect(310, 640, 380, 220, 110, main), ellipse(500, 660, 186, 50, light)].join('')
    case 'coffee':
      return [
        ellipse(500, 862, 330, 24, P.ink, 0.12),
        rect(380, 640, 240, 220, 30, wood),
        rect(380, 640, 240, 30, 10, woodDark),
        ellipse(500, 620, 320, 66, dark),
        ellipse(500, 606, 320, 66, main),
      ].join('')
    case 'side':
      return [
        ellipse(500, 862, 170, 16, P.ink, 0.12),
        rect(480, 560, 40, 300, 12, woodDark),
        ellipse(500, 860, 110, 20, woodDark),
        ellipse(500, 556, 170, 34, dark),
        ellipse(500, 546, 170, 34, wood),
      ].join('')
    case 'dining':
      return [
        shadow,
        `<path d="M230 540 L300 860 L330 860 L270 540Z M770 540 L700 860 L670 860 L730 540Z" fill="${woodDark}"/>`,
        rect(240, 640, 520, 18, 9, woodDark),
        rect(110, 500, 780, 44, 14, wood),
        rect(110, 528, 780, 16, 8, woodDark),
      ].join('')
    case 'round':
      return [
        ellipse(500, 862, 300, 24, P.ink, 0.12),
        `<path d="M440 560 L400 860 L600 860 L560 560Z" fill="${woodDark}"/>`,
        ellipse(500, 520, 330, 64, shade(wood, -0.1)),
        ellipse(500, 506, 330, 64, wood),
      ].join('')
    case 'desk':
      return [
        shadow,
        rect(150, 520, 20, 340, 6, P.ink),
        rect(830, 520, 20, 340, 6, P.ink),
        rect(150, 520, 700, 20, 6, P.ink),
        rect(560, 540, 260, 110, 14, wood),
        rect(580, 590, 220, 6, 3, woodDark),
        rect(120, 480, 760, 40, 12, wood),
      ].join('')
    case 'chair':
      return [
        ellipse(500, 862, 200, 18, P.ink, 0.12),
        legs([400, 600], 600, 260, 16),
        rect(395, 360, 210, 130, 64, wood),
        rect(410, 380, 180, 90, 46, main),
        rect(470, 480, 60, 120, 10, woodDark),
        rect(370, 580, 260, 40, 16, wood),
        rect(380, 560, 240, 34, 16, main),
      ].join('')
    case 'stool':
      return [
        ellipse(500, 862, 170, 16, P.ink, 0.12),
        `<path d="M430 640 L380 860 L400 860 L452 640Z M570 640 L620 860 L600 860 L548 640Z" fill="${woodDark}"/>`,
        rect(492, 640, 16, 220, 6, woodDark),
        ellipse(500, 640, 150, 30, shade(wood, -0.1)),
        ellipse(500, 628, 150, 30, wood),
      ].join('')
    case 'barstool':
      return [
        ellipse(500, 862, 160, 14, P.ink, 0.12),
        rect(410, 420, 14, 440, 6, P.ink),
        rect(576, 420, 14, 440, 6, P.ink),
        rect(410, 700, 180, 12, 6, P.ink),
        ellipse(500, 420, 140, 28, shade(wood, -0.1)),
        ellipse(500, 408, 140, 28, wood),
        rect(420, 300, 160, 70, 30, main),
      ].join('')
    case 'bench':
      return [
        ellipse(500, 862, 360, 20, P.ink, 0.12),
        rect(190, 660, 30, 200, 8, woodDark),
        rect(780, 660, 30, 200, 8, woodDark),
        rect(190, 760, 620, 14, 7, woodDark),
        rect(140, 620, 720, 50, 16, wood),
        rect(160, 590, 680, 40, 18, main),
      ].join('')
    case 'shelf': {
      // стеллаж-лесенка: ступени-террасы
      const cols = [0, 1, 2, 3, 4]
      return [
        shadow,
        ...cols.map((i) => {
          const h = 160 + i * 110
          const x = 160 + i * 140
          return rect(x, 860 - h, 140, h, 10, i % 2 ? wood : shade(wood, 0.08)) + rect(x + 10, 860 - h + 10, 120, h - 20, 6, shade(wood, -0.18))
        }),
        rect(195, 640, 50, 60, 10, main),
        ellipse(490, 470, 40, 40, c.accent ?? light),
        rect(620, 300, 70, 90, 30, main),
        rect(760, 240, 30, 50, 8, dark),
      ].join('')
    }
    case 'sideboard':
      return [
        shadow,
        legs([200, 800], 780, 80, 16),
        rect(140, 460, 720, 330, 18, wood),
        rect(150, 470, 226, 310, 10, shade(wood, 0.06)),
        rect(387, 470, 226, 310, 10, shade(wood, 0.06)),
        rect(624, 470, 226, 310, 10, shade(wood, 0.06)),
        rect(130, 440, 740, 30, 10, main),
        ellipse(330, 380, 46, 60, c.accent ?? light),
      ].join('')
    case 'chest':
      return [
        ellipse(500, 862, 300, 22, P.ink, 0.12),
        legs([290, 710], 800, 60, 16),
        rect(240, 360, 520, 450, 18, wood),
        ...[0, 1, 2].map((i) => rect(258, 378 + i * 142, 484, 128, 10, shade(wood, 0.07)) + rect(470, 435 + i * 142, 60, 12, 6, woodDark)),
      ].join('')
    case 'cabinet':
      return [
        ellipse(500, 862, 260, 20, P.ink, 0.12),
        `<path d="M290 860 L290 330 A210 210 0 0 1 710 330 L710 860Z" fill="${wood}"/>`,
        `<path d="M318 840 L318 336 A182 182 0 0 1 682 336 L682 840Z" fill="${shade(main, 0.35)}" opacity="0.9"/>`,
        rect(318, 470, 364, 10, 4, woodDark),
        rect(318, 620, 364, 10, 4, woodDark),
        ellipse(420, 445, 36, 28, dark),
        rect(560, 560, 60, 60, 12, light),
        ellipse(450, 595, 30, 30, c.accent ?? dark),
        rect(495, 330, 10, 510, 4, woodDark),
      ].join('')
    case 'bed':
      return [
        ellipse(500, 862, 420, 26, P.ink, 0.12),
        legs([150, 850], 800, 60, 18),
        rect(110, 360, 780, 320, 120, dark),
        rect(110, 640, 780, 170, 30, wood),
        rect(140, 590, 720, 130, 36, P.paper),
        rect(140, 640, 720, 140, 40, light),
        rect(180, 520, 230, 110, 44, P.paper),
        rect(590, 520, 230, 110, 44, P.paper),
      ].join('')
    case 'nightstand':
      return [
        ellipse(500, 862, 200, 18, P.ink, 0.12),
        legs([380, 620], 780, 80, 14),
        rect(340, 560, 320, 230, 18, wood),
        rect(358, 580, 284, 90, 10, shade(wood, 0.07)),
        rect(470, 618, 60, 10, 5, woodDark),
        ellipse(430, 520, 40, 44, c.accent ?? main),
        rect(520, 470, 80, 90, 10, main),
      ].join('')
    case 'lamp':
      return [
        rect(497, 0, 6, 420, 3, P.ink),
        ellipse(500, 700, 240, 34, c.accent ?? P.paper, 0.6),
        `<path d="M260 610 A240 240 0 0 1 740 610 Z" fill="${main}"/>`,
        rect(258, 600, 484, 22, 11, dark),
        ellipse(500, 640, 80, 26, P.paper, 0.9),
        rect(470, 400, 60, 40, 14, P.ink),
      ].join('')
    case 'mirror':
      return [
        ellipse(500, 862, 220, 16, P.ink, 0.1),
        `<path d="M330 860 L330 330 A170 170 0 0 1 670 330 L670 860Z" fill="${wood}"/>`,
        `<path d="M352 840 L352 334 A148 148 0 0 1 648 334 L648 840Z" fill="${shade(P.mist, 0.3)}"/>`,
        `<path d="M400 420 L600 300 L620 330 L420 450Z" fill="${P.paper}" opacity="0.6"/>`,
      ].join('')
    case 'vase':
      return [
        ellipse(500, 862, 150, 14, P.ink, 0.12),
        rect(400, 700, 200, 160, 18, main),
        rect(425, 590, 150, 120, 16, shade(main, 0.08)),
        rect(450, 500, 100, 100, 14, shade(main, 0.15)),
        `<path d="M500 500 C 490 380 440 300 380 240 M500 500 C 520 360 580 300 640 230" stroke="${woodDark}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
        ellipse(380, 236, 22, 34, c.accent ?? P.blush),
        ellipse(640, 226, 22, 34, c.accent ?? P.blush),
      ].join('')
  }
}

/** Ступенчатый фон «терраса» тон в тон */
function terrace(x: number, y: number, size: number, steps: number, fill: string): string {
  const w = size / steps
  return Array.from({ length: steps }, (_, i) => rect(x + i * w, y + size - w * (i + 1), w + 0.5, w * (i + 1), 10, fill)).join('')
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

async function render(svg: string, format: 'png' | 'jpeg' = 'png'): Promise<Buffer> {
  const img = sharp(Buffer.from(svg))
  return format === 'png' ? img.png({ compressionLevel: 8 }).toBuffer() : img.jpeg({ quality: 86 }).toBuffer()
}

/** Фото товара 4:5: 0 — основное на пастельном фоне, 1 — второе ракурсом, 2 — деталь фактуры */
export async function productImage(o: { type: FurnitureType; colors: Colors; bg: string; title: string; view: 0 | 1 | 2 }): Promise<Buffer> {
  const W = 1200
  const H = 1500
  const bg = o.view === 1 ? P.sand : o.view === 2 ? shade(o.colors.main, 0.25) : o.bg
  const tone = shade(bg, -0.05)
  let art = ''
  if (o.view === 0) art = `<g transform="translate(110 260) scale(0.98)">${furniture(o.type, o.colors)}</g>`
  if (o.view === 1) art = `<g transform="translate(-180 120) scale(1.55)">${furniture(o.type, o.colors)}</g>`
  if (o.view === 2) {
    // деталь: крупная фактура материала
    const lines = Array.from({ length: 26 }, (_, i) => `<path d="M-50 ${i * 64} C 300 ${i * 64 - 40}, 800 ${i * 64 + 50}, 1300 ${i * 64 - 10}" stroke="${shade(o.colors.main, -0.08)}" stroke-width="10" fill="none" opacity="0.6"/>`).join('')
    art = lines + `<circle cx="860" cy="420" r="150" fill="${o.colors.wood}"/><circle cx="860" cy="420" r="110" fill="${shade(o.colors.wood, 0.12)}"/>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  ${o.view !== 2 ? terrace(W - 640, H - 640, 640, 5, tone) : ''}
  ${art}
  <text x="64" y="${H - 80}" font-family="${FONT}" font-size="54" font-weight="600" fill="${P.ink}" opacity="0.88">${esc(o.title)}</text>
  <text x="64" y="96" font-family="${FONT}" font-size="26" font-weight="700" letter-spacing="4" fill="${P.ink}" opacity="0.55">OBLIK</text>
</svg>`
  return render(svg, 'jpeg')
}

/** Вырезка для витрины: мебель на прозрачном фоне с мягкой тенью */
export async function cutoutImage(o: { type: FurnitureType; colors: Colors; types?: FurnitureType[] }): Promise<Buffer> {
  const items = o.types ?? [o.type]
  const n = items.length
  const groups = items
    .map((t, i) => {
      const scale = n === 1 ? 0.92 : 0.62
      const x = n === 1 ? 40 : 40 + (i - (n - 1) / 2) * 300 + 150
      const y = n === 1 ? 40 : 300 + (i % 2) * 40
      return `<g transform="translate(${x} ${y}) scale(${scale})">${furniture(t, o.colors)}</g>`
    })
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1000 1000">${groups}</svg>`
  return render(svg, 'png')
}

/** Интерьер: стена, пол, окно-арка и 2–3 предмета */
export async function interiorImage(o: { wall: string; floor: string; items: Array<{ type: FurnitureType; colors: Colors }>; seed: number; title?: string }): Promise<Buffer> {
  const W = 1800
  const H = 1200
  const positions = [
    { x: 120, y: 260, s: 0.95 },
    { x: 900, y: 380, s: 0.78 },
    { x: 1250, y: 480, s: 0.6 },
  ]
  const items = o.items
    .slice(0, 3)
    .map((it, i) => `<g transform="translate(${positions[i].x} ${positions[i].y}) scale(${positions[i].s})">${furniture(it.type, it.colors)}</g>`)
    .join('')
  const winX = 300 + (o.seed % 4) * 260
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${o.wall}"/>
  <path d="M${winX} 760 L${winX} 300 A190 190 0 0 1 ${winX + 380} 300 L${winX + 380} 760Z" fill="${shade(o.wall, 0.35)}"/>
  <rect x="${winX + 186}" y="110" width="8" height="650" fill="${shade(o.wall, -0.06)}"/>
  <rect y="1080" width="${W}" height="${H - 1080}" fill="${o.floor}"/>
  <rect y="1070" width="${W}" height="14" fill="${shade(o.floor, -0.12)}"/>
  ${terrace(W - 420, 660, 420, 4, shade(o.wall, -0.05))}
  ${items}
  ${o.title ? `<text x="64" y="${H - 44}" font-family="${FONT}" font-size="34" font-weight="600" fill="${P.ink}" opacity="0.7">${esc(o.title)}</text>` : ''}
</svg>`
  return render(svg, 'jpeg')
}

/** Свотч материала: дерево — волокна, ткань — плетение, металл — гладко, камень — поры */
export async function swatchImage(o: { kind: 'wood' | 'fabric' | 'metal' | 'stone' | 'other'; color: string }): Promise<Buffer> {
  const S = 600
  const d = shade(o.color, -0.1)
  const l = shade(o.color, 0.12)
  let pattern = ''
  if (o.kind === 'wood') pattern = Array.from({ length: 22 }, (_, i) => `<path d="M0 ${i * 30} C 150 ${i * 30 - 20}, 400 ${i * 30 + 26}, 600 ${i * 30 - 6}" stroke="${d}" stroke-width="5" fill="none"/>`).join('')
  if (o.kind === 'fabric')
    pattern = Array.from({ length: 30 }, (_, i) => `<rect x="0" y="${i * 20}" width="${S}" height="8" fill="${d}" opacity="0.35"/><rect x="${i * 20}" y="0" width="8" height="${S}" fill="${l}" opacity="0.45"/>`).join('')
  if (o.kind === 'stone')
    pattern = Array.from({ length: 70 }, (_, i) => `<ellipse cx="${(i * 97) % S}" cy="${(i * 53) % S}" rx="${6 + (i % 5) * 3}" ry="${3 + (i % 3) * 2}" fill="${d}" opacity="0.45"/>`).join('')
  if (o.kind === 'metal') pattern = `<rect width="${S}" height="${S / 2}" fill="${l}" opacity="0.25"/>`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><rect width="${S}" height="${S}" fill="${o.color}"/>${pattern}</svg>`
  return render(svg, 'jpeg')
}

/** Абстрактный портрет дизайнера */
export async function portraitImage(o: { bg: string; tone: string }): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
  <rect width="800" height="1000" fill="${o.bg}"/>
  ${terrace(380, 580, 420, 4, shade(o.bg, -0.06))}
  <circle cx="400" cy="400" r="150" fill="${o.tone}"/>
  <path d="M150 1000 C 150 720, 650 720, 650 1000Z" fill="${shade(o.tone, -0.12)}"/>
</svg>`
  return render(svg, 'jpeg')
}

/** Статичная карта шоурума: кварталы, Сава и Дунай условно, пин */
export async function mapImage(): Promise<Buffer> {
  const W = 1600
  const H = 900
  const blocks = Array.from({ length: 60 }, (_, i) => {
    const x = (i % 10) * 170 + ((i * 37) % 40)
    const y = Math.floor(i / 10) * 160 + ((i * 53) % 30)
    return rect(x, y, 130, 110, 14, i % 7 === 0 ? P.pistachio : P.paper)
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${P.sand}"/>
  ${blocks}
  <path d="M-20 760 C 300 680, 600 860, 900 720 S 1400 620, 1640 700" stroke="${P.mist}" stroke-width="90" fill="none"/>
  <circle cx="820" cy="420" r="70" fill="${P['lavender-600']}" opacity="0.18"/>
  <path d="M820 470 C 780 420, 760 400, 760 370 A60 60 0 0 1 880 370 C 880 400, 860 420, 820 470Z" fill="${P.plum}"/>
  <circle cx="820" cy="370" r="22" fill="${P.lavender}"/>
</svg>`
  return render(svg, 'jpeg')
}

export { shade }

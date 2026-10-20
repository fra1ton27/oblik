/**
 * Геометрия шейпов на сетке 8 px. Пути строятся с одинаковым числом точек,
 * поэтому террасы с разным числом ступеней и галочка морфятся друг в друга (MorphSVG).
 */

export type Point = [number, number]

/** Многоугольник со скруглёнными углами (радиус r, не больше половины соседних рёбер) */
export function roundedPolygon(points: Point[], r: number): string {
  const n = points.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]
    const cur = points[i]
    const next = points[(i + 1) % n]
    const v1 = [prev[0] - cur[0], prev[1] - cur[1]]
    const v2 = [next[0] - cur[0], next[1] - cur[1]]
    const l1 = Math.hypot(v1[0], v1[1]) || 1
    const l2 = Math.hypot(v2[0], v2[1]) || 1
    const rr = Math.min(r, l1 / 2, l2 / 2)
    const a: Point = [cur[0] + (v1[0] / l1) * rr, cur[1] + (v1[1] / l1) * rr]
    const b: Point = [cur[0] + (v2[0] / l2) * rr, cur[1] + (v2[1] / l2) * rr]
    d += `${i === 0 ? 'M' : 'L'}${fmt(a[0])},${fmt(a[1])} Q${fmt(cur[0])},${fmt(cur[1])} ${fmt(b[0])},${fmt(b[1])} `
  }
  return d + 'Z'
}

function fmt(v: number) {
  return Math.round(v * 100) / 100
}

/** Точки силуэта лесенки: ступени поднимаются слева направо */
export function terracePoints(steps: number, width: number, height: number): Point[] {
  const w = width / steps
  const h = height / steps
  const pts: Point[] = [[0, height]]
  for (let i = 0; i < steps; i++) {
    const top = height - h * (i + 1)
    pts.push([w * i, top], [w * (i + 1), top])
  }
  pts.push([width, height])
  // убираем точки, лежащие на одной прямой с соседями (кроме первой ступени)
  return pts
}

/** Путь террасы: ступени на сетке 8 px со скруглением 4 px */
export function terracePath(steps: number, width: number, height: number, radius = 4): string {
  return roundedPolygon(terracePoints(steps, width, height), radius)
}

/** Колонки террасы — для поступенчатого проявления через clip-path со stagger */
export function terraceColumns(steps: number, width: number, height: number) {
  const w = width / steps
  const h = height / steps
  return Array.from({ length: steps }, (_, i) => ({
    x: w * i,
    y: height - h * (i + 1),
    width: w,
    height: h * (i + 1),
  }))
}

/** Колонка с закруглённым верхним левым (и правым у последней) углом */
export function columnPath(x: number, y: number, w: number, h: number, r: number, roundRight: boolean) {
  const rr = Math.min(r, w / 2, h / 2)
  const tr = roundRight ? rr : 0
  return [
    `M${fmt(x)},${fmt(y + h)}`,
    `L${fmt(x)},${fmt(y + rr)}`,
    `Q${fmt(x)},${fmt(y)} ${fmt(x + rr)},${fmt(y)}`,
    `L${fmt(x + w - tr)},${fmt(y)}`,
    tr ? `Q${fmt(x + w)},${fmt(y)} ${fmt(x + w)},${fmt(y + tr)}` : '',
    `L${fmt(x + w)},${fmt(y + h)}`,
    'Z',
  ].join(' ')
}

/** Галочка-многоугольник: в неё морфится терраса после успешной отправки */
export function checkPath(size: number, radius = 4): string {
  const s = size
  const pts: Point[] = [
    [s * 0.1, s * 0.52],
    [s * 0.22, s * 0.4],
    [s * 0.4, s * 0.58],
    [s * 0.78, s * 0.2],
    [s * 0.9, s * 0.32],
    [s * 0.4, s * 0.82],
  ]
  return roundedPolygon(pts, radius)
}

/**
 * Неровный «рукописный» овал: замкнутая кривая, начало и конец слегка расходятся,
 * как будто обвели от руки. pathLength=1 позволяет рисовать линию через dashoffset.
 */
export function handCirclePath(width: number, height: number, seed = 1): string {
  const cx = width / 2
  const cy = height / 2
  const rx = width / 2 - 4
  const ry = height / 2 - 4
  const rand = mulberry32(seed)
  const n = 9
  const pts: Point[] = []
  for (let i = 0; i <= n + 1; i++) {
    const a = (-Math.PI / 2 - 0.35) + (i / n) * Math.PI * 2 * 1.04
    const k = 1 + (rand() - 0.5) * 0.06
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
  }
  // сглаживание Catmull-Rom → кубические Безье
  let d = `M${fmt(pts[0][0])},${fmt(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`
  }
  return d
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

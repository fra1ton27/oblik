import { getTranslations } from 'next-intl/server'
import type { DimensionsBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { formatLength, formatWeight } from '@/lib/format'
import { SplitHeading } from '@/components/motion/SplitHeading'

/** Размеры: линейный SVG-чертёж с размерными линиями + таблица. В EN рядом с см — дюймы. */
export async function DimensionsBlockView({ block, context }: { block: DimensionsBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  const d = context.product?.dimensions
  if (!d || !(d.width || d.height)) return null
  const L = context.locale
  const rows = [
    d.width && [t('width'), formatLength(d.width, L)],
    d.depth && [t('depth'), formatLength(d.depth, L)],
    d.height && [t('height'), formatLength(d.height, L)],
    d.seatHeight && [t('seatHeight'), formatLength(d.seatHeight, L)],
    d.weight && [t('weight'), formatWeight(d.weight, L)],
  ].filter(Boolean) as Array<[string, string]>

  // Пропорциональный фронтальный вид: прямоугольник W × H, вырезы под сиденье
  const W = 520
  const scale = W / Math.max(d.width ?? 100, 1)
  const H = Math.min(360, Math.max(80, (d.height ?? 80) * scale))
  const seat = d.seatHeight ? Math.max(20, H - d.seatHeight * scale) : null
  const ox = 70
  const oy = 30

  return (
    <section className="mt-section" id="dimensions">
      <div className="container-site grid gap-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <SplitHeading className="t-h1">{block.heading || t('dimensionsHeading')}</SplitHeading>
          {block.note && <p className="t-lead mt-4 text-ink-soft">{block.note}</p>}
          <dl className="mt-8 border-t border-line">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line py-3 text-[15px]">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="rounded-section bg-paper p-6 md:col-span-7 md:p-10">
          <svg viewBox={`0 0 ${W + 140} ${H + 110}`} className="h-auto w-full" role="img" aria-label={t('drawingLabel')}>
            <g fill="none" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinejoin="round">
              <rect x={ox} y={oy} width={W} height={H} rx="10" />
              {seat !== null && <path d={`M${ox + 24} ${oy + seat} H${ox + W - 24}`} strokeDasharray="6 6" />}
              <path d={`M${ox + 30} ${oy + H} v14 M${ox + W - 30} ${oy + H} v14`} />
            </g>
            <g stroke="var(--color-lavender-600)" strokeWidth="1" fill="var(--color-lavender-600)" fontFamily="var(--font-sans)" fontSize="14">
              {/* ширина */}
              <path d={`M${ox} ${oy + H + 40} H${ox + W}`} />
              <path d={`M${ox} ${oy + H + 32} v16 M${ox + W} ${oy + H + 32} v16`} />
              <text x={ox + W / 2} y={oy + H + 64} textAnchor="middle" stroke="none">
                {formatLength(d.width ?? 0, L)}
              </text>
              {/* высота */}
              <path d={`M${ox - 34} ${oy} V${oy + H}`} />
              <path d={`M${ox - 42} ${oy} h16 M${ox - 42} ${oy + H} h16`} />
              <text x={ox - 44} y={oy + H / 2} textAnchor="middle" stroke="none" transform={`rotate(-90 ${ox - 44} ${oy + H / 2})`}>
                {formatLength(d.height ?? 0, L)}
              </text>
              {seat !== null && d.seatHeight && (
                <>
                  <path d={`M${ox + W + 30} ${oy + seat} V${oy + H}`} />
                  <path d={`M${ox + W + 22} ${oy + seat} h16 M${ox + W + 22} ${oy + H} h16`} />
                  <text x={ox + W + 52} y={oy + (seat + H) / 2} stroke="none">
                    {formatLength(d.seatHeight, L)}
                  </text>
                </>
              )}
            </g>
          </svg>
          {d.depth && (
            <figcaption className="t-small mt-3 flex gap-2 font-normal text-ink-soft">
              <span>{t('depth')}</span>
              <span className="font-semibold text-ink">{formatLength(d.depth, L)}</span>
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}

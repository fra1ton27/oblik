import type { DragCanvasBlock, Review } from '@/payload-types'
import type { BlockContext } from '../types'
import { toImage } from '@/lib/media'
import { toReview } from '@/lib/data/globals'
import { DragCanvas, type CanvasTile } from './DragCanvas'

/** «Интерьеры клиентов»: полотно фото интерьеров и отзывов на наклонённых карточках */
export function DragCanvasBlockView({ block }: { block: DragCanvasBlock; context: BlockContext }) {
  const tiles: CanvasTile[] = []
  for (const [i, item] of (block.items ?? []).entries()) {
    const image = toImage(item.image, 'card', item.caption ?? '')
    if (image) tiles.push({ kind: 'photo', id: `p-${item.id ?? i}`, image, caption: item.caption ?? '' })
    if (item.review && typeof item.review === 'object') {
      const r = toReview(item.review as Review)
      tiles.push({ kind: 'review', id: `r-${r.id}-${i}`, review: r })
    }
  }
  if (!tiles.length) return null
  return <DragCanvas heading={block.heading ?? ''} lead={block.lead ?? ''} tiles={tiles} />
}

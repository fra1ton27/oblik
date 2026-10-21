import { Suspense } from 'react'
import type { Homepage } from '@/payload-types'
import type { BlockContext } from './types'
import { HeroBlockView } from './Hero/Component'
import { StackedCardsBlockView } from './StackedCards/Component'
import { ShowcaseBlockView } from './Showcase/Component'
import { ProductCarouselBlockView } from './ProductCarousel/Component'
import { StatsBlockView } from './Stats/Component'
import { CTABlockView } from './CTA/Component'
import { DragCanvasBlockView } from './DragCanvas/Component'
import { StoryBlockView } from './Story/Component'
import { MaterialsBlockView } from './Materials/Component'
import { DimensionsBlockView } from './Dimensions/Component'
import { BundleBuilderBlockView } from './BundleBuilder/Component'
import { FAQBlockView } from './FAQ/Component'
import { ReviewsBlockView } from './Reviews/Component'
import { RichTextBlockView } from './RichText/Component'
import { GalleryBlockView } from './Gallery/Component'

export type AnyBlock = NonNullable<Homepage['layout']>[number]

/** Один React-компонент на блок Payload; порядок и состав задаются в админке */
function blockView(block: AnyBlock, ctx: BlockContext) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlockView block={block} context={ctx} />
    case 'stackedCards':
      return <StackedCardsBlockView block={block} context={ctx} />
    case 'showcase':
      return <ShowcaseBlockView block={block} context={ctx} />
    case 'productCarousel':
      return <ProductCarouselBlockView block={block} context={ctx} />
    case 'stats':
      return <StatsBlockView block={block} context={ctx} />
    case 'cta':
      return <CTABlockView block={block} context={ctx} />
    case 'dragCanvas':
      return <DragCanvasBlockView block={block} context={ctx} />
    case 'story':
      return <StoryBlockView block={block} context={ctx} />
    case 'materials':
      return <MaterialsBlockView block={block} context={ctx} />
    case 'dimensions':
      return <DimensionsBlockView block={block} context={ctx} />
    case 'bundleBuilder':
      return <BundleBuilderBlockView block={block} context={ctx} />
    case 'faq':
      return <FAQBlockView block={block} context={ctx} />
    case 'reviews':
      return <ReviewsBlockView block={block} context={ctx} />
    case 'richText':
      return <RichTextBlockView block={block} context={ctx} />
    case 'gallery':
      return <GalleryBlockView block={block} context={ctx} />
    default:
      return null
  }
}

/**
 * Каждый блок — в своей Suspense-границе: на сервере это ничего не меняет, а на клиенте React
 * гидрирует секции по отдельности, вместо одной длинной задачи на всю страницу (TBT, раздел 13 ТЗ).
 */
export function RenderBlocks({ blocks, context }: { blocks: AnyBlock[] | null | undefined; context: BlockContext }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, index) => {
        const view = blockView(block, { ...context, first: index === 0, index })
        return view ? (
          <Suspense key={block.id ?? `${block.blockType}-${index}`} fallback={null}>
            {view}
          </Suspense>
        ) : null
      })}
    </>
  )
}

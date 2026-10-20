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
export function RenderBlocks({ blocks, context }: { blocks: AnyBlock[] | null | undefined; context: BlockContext }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, index) => {
        const ctx = { ...context, first: index === 0, index }
        const key = block.id ?? `${block.blockType}-${index}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlockView key={key} block={block} context={ctx} />
          case 'stackedCards':
            return <StackedCardsBlockView key={key} block={block} context={ctx} />
          case 'showcase':
            return <ShowcaseBlockView key={key} block={block} context={ctx} />
          case 'productCarousel':
            return <ProductCarouselBlockView key={key} block={block} context={ctx} />
          case 'stats':
            return <StatsBlockView key={key} block={block} context={ctx} />
          case 'cta':
            return <CTABlockView key={key} block={block} context={ctx} />
          case 'dragCanvas':
            return <DragCanvasBlockView key={key} block={block} context={ctx} />
          case 'story':
            return <StoryBlockView key={key} block={block} context={ctx} />
          case 'materials':
            return <MaterialsBlockView key={key} block={block} context={ctx} />
          case 'dimensions':
            return <DimensionsBlockView key={key} block={block} context={ctx} />
          case 'bundleBuilder':
            return <BundleBuilderBlockView key={key} block={block} context={ctx} />
          case 'faq':
            return <FAQBlockView key={key} block={block} context={ctx} />
          case 'reviews':
            return <ReviewsBlockView key={key} block={block} context={ctx} />
          case 'richText':
            return <RichTextBlockView key={key} block={block} context={ctx} />
          case 'gallery':
            return <GalleryBlockView key={key} block={block} context={ctx} />
          default:
            return null
        }
      })}
    </>
  )
}

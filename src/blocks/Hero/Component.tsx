import type { HeroBlock, Media } from '@/payload-types'
import type { BlockContext } from '../types'
import { toImage } from '@/lib/media'
import { HomeHero } from './HomeHero'
import { PageHero } from './PageHero'

/** Hero: на главной — огромное слово, наклонённая карточка с фото/видео, лид с чипом, CTA и «Листайте» */
export async function HeroBlockView({ block, context }: { block: HeroBlock; context: BlockContext }) {
  const lines = (block.lines ?? []).map((l) => l.text).filter(Boolean)
  const image = toImage(block.media, 'hero', lines.join(' '))
  const video = block.video && typeof block.video === 'object' && (block.video as Media).mimeType?.startsWith('video/') ? (block.video as Media).url ?? null : null

  if (block.variant === 'home') {
    return (
      <HomeHero
        lines={lines}
        chip={block.chip ?? ''}
        lead={block.lead ?? ''}
        image={image}
        video={video}
        ctaLabel={block.ctaLabel ?? ''}
        ctaRoute={block.ctaRoute ?? '/catalog'}
        priority={Boolean(context.first)}
      />
    )
  }
  return <PageHero lines={lines} chip={block.chip ?? ''} lead={block.lead ?? ''} image={image} variant={block.variant ?? 'page'} priority={Boolean(context.first)} />
}

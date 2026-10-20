import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Designer, StoryBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { toImage, type ImageDTO } from '@/lib/media'
import { plainText } from '@/lib/richtext'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { Reveal } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'

/** История: большой заголовок, цитата дизайнера в Cormorant italic, 2–3 наклонённых фото */
export async function StoryBlockView({ block, context }: { block: StoryBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  const product = context.product
  const designer = product?.designer && typeof product.designer === 'object' ? (product.designer as Designer) : null
  const heading = block.heading || (context.page === 'product' ? t('storyHeading') : '')
  const text = block.text || (product ? plainText(product.description) : '')
  const quote = block.quote || designer?.quote || ''
  const author = block.quoteAuthor || designer?.name || ''
  let images: ImageDTO[] = (block.images ?? []).map((m) => toImage(m, 'card')).filter((x): x is ImageDTO => Boolean(x))
  if (!images.length && product) images = (product.images ?? []).slice(1, 3).map((r) => toImage(r.image, 'card', product.title)).filter((x): x is ImageDTO => Boolean(x))
  if (!heading && !text && !quote) return null
  const tilts = [-4, 5, -2]

  return (
    <section className="mt-section" id={context.page === 'page' ? 'story' : undefined}>
      <div className="container-site grid gap-10 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-6">
          <SplitHeading className="t-h1">{heading}</SplitHeading>
          {text && <p className="t-lead max-w-[46ch] text-ink-soft">{text}</p>}
          {quote && (
            <figure className="mt-4 border-l border-line pl-6">
              <blockquote className="t-serif before:content-[open-quote] after:content-[close-quote]">{quote.replace(/^[«"„“]|[»"”]$/g, '')}</blockquote>
              {author && <figcaption className="t-caption mt-4 text-ink-soft">{author}</figcaption>}
            </figure>
          )}
        </div>
        {images.length > 0 && (
          <Reveal className="relative grid grid-cols-2 gap-4 md:col-span-6 md:gap-6" stagger={0.1}>
            {images.slice(0, 3).map((img, i) => (
              <div key={img.src} data-reveal-item className={i === 0 ? 'col-span-2 md:col-span-1 md:row-span-2' : ''}>
                <TiltCard tilt={tilts[i]} mobileTilt={tilts[i] / 2} className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand shadow-float">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 25vw, 46vw" placeholder="blur" blurDataURL={img.blur} className="object-cover" />
                </TiltCard>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}

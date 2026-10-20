import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { GalleryBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { toImage, type ImageDTO } from '@/lib/media'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TiltCard } from '@/components/motion/TiltCard'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'

/** Галерея: интерьерные фото на лёгком наклоне, первое — крупно */
export async function GalleryBlockView({ block, context }: { block: GalleryBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  let images = (block.images ?? []).map((m) => toImage(m, 'hero')).filter((x): x is ImageDTO => Boolean(x))
  if (!images.length && context.collection) images = context.collection.gallery
  if (!images.length) return null
  const tilts = [-2, 3, -4, 2, -3]
  return (
    <section className="mt-section" id={context.page === 'page' ? 'production' : 'gallery'}>
      <div className="container-site">
        <SplitHeading className="t-h1 mb-8">{block.heading || t('galleryHeading')}</SplitHeading>
        <Reveal className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-6" stagger={0.08}>
          {images.slice(0, 5).map((img, i) => (
            <div key={img.src + i} data-reveal-item className={cn(i === 0 ? 'col-span-2 md:col-span-4 md:row-span-2' : 'col-span-1 md:col-span-2')}>
              <TiltCard tilt={tilts[i % tilts.length]} mobileTilt={0} className={cn('relative overflow-hidden rounded-card bg-sand', i === 0 ? 'aspect-[4/3]' : 'aspect-square')}>
                <Image src={img.src} alt={img.alt} fill sizes={i === 0 ? '(min-width: 768px) 60vw, 92vw' : '(min-width: 768px) 30vw, 46vw'} placeholder="blur" blurDataURL={img.blur} className="object-cover" />
              </TiltCard>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

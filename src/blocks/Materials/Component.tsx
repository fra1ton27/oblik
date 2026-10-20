import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Material, MaterialsBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { toImage } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { Reveal } from '@/components/motion/Reveal'

/** Материалы: карточки с макрофото, происхождением и уходом (из коллекции materials) */
export async function MaterialsBlockView({ block, context }: { block: MaterialsBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  let materials: Material[] = []
  if (context.product) {
    const ids = new Set<number>()
    const add = (m: unknown) => {
      if (m && typeof m === 'object' && !ids.has((m as Material).id)) {
        ids.add((m as Material).id)
        materials.push(m as Material)
      }
    }
    context.product.materials?.forEach(add)
    context.product.variants?.forEach((v) => {
      add(v.fabric)
      add(v.finish)
    })
  } else {
    const payload = await getPayloadClient()
    materials = (await payload.find({ collection: 'materials', locale: context.locale, depth: 1, limit: 20, pagination: false })).docs as Material[]
  }
  if (!materials.length) return null

  return (
    <section className="mt-section" id="materials">
      <div className="container-site">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SplitHeading className="t-h1">{block.heading || t('materialsHeading')}</SplitHeading>
          {block.lead && <p className="t-lead max-w-[38ch] text-ink-soft">{block.lead}</p>}
        </div>
        <Reveal as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((m) => {
            const img = toImage(m.macro ?? m.swatch, 'card', m.title)
            return (
              <li key={m.id} data-reveal-item className="flex flex-col overflow-hidden rounded-card border border-line bg-paper">
                <div className="relative aspect-[4/3] bg-sand" style={{ backgroundColor: m.swatchColor ?? undefined }}>
                  {img && <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 22vw, (min-width: 480px) 45vw, 92vw" className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="t-h3">{m.title}</h3>
                  {m.description && <p className="t-small font-normal text-ink-soft">{m.description}</p>}
                  <dl className="mt-auto grid gap-2 border-t border-line pt-3 text-[14px]">
                    {m.origin && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-ink-soft">{t('origin')}</dt>
                        <dd className="text-right font-semibold">{m.origin}</dd>
                      </div>
                    )}
                    {m.care && (
                      <div>
                        <dt className="text-ink-soft">{t('care')}</dt>
                        <dd className="mt-1">{m.care}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </li>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

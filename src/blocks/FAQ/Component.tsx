import { getTranslations } from 'next-intl/server'
import type { FAQBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { getSiteSettings } from '@/lib/data/globals'
import { Accordion } from '@/components/ui/Accordion'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { JsonLd } from '@/components/seo/JsonLd'

/** FAQ аккордеоном (3–5 вопросов) с разметкой FAQPage */
export async function FAQBlockView({ block, context }: { block: FAQBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  let items = (block.items ?? []).map((i) => ({ q: i.question, a: i.answer }))
  if (!items.length && context.product?.faq?.length) items = context.product.faq.map((i) => ({ q: i.question, a: i.answer }))
  if (!items.length) {
    const settings = await getSiteSettings(context.locale).catch(() => null)
    items = (settings?.defaultProductFaq ?? []).map((i) => ({ q: i.question, a: i.answer }))
  }
  if (!items.length) return null
  return (
    <section className="mt-section" id="faq">
      <div className="container-site grid gap-8 md:grid-cols-12">
        <SplitHeading className="t-h1 md:col-span-5">{block.heading || t('faqHeading')}</SplitHeading>
        <div className="md:col-span-7">
          <Accordion exclusive name={`faq-${block.id ?? 'p'}`} items={items.slice(0, 8).map((i, n) => ({ id: String(n), title: i.q, content: <p className="max-w-[60ch] text-ink-soft">{i.a}</p> }))} />
        </div>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
        }}
      />
    </section>
  )
}

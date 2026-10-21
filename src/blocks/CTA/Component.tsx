import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { CTABlock } from '@/payload-types'
import type { BlockContext } from '../types'
import type { StaticPathname } from '@/i18n/routing'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { StepReveal } from '@/components/motion/StepReveal'
import { Terrace } from '@/components/shapes'
import { buttonClasses } from '@/components/ui/Button'
import { LazyContactForm, LazyCustomOrderForm } from '@/components/forms/LazyForms'
import { CustomOrderModalButton } from '@/components/forms/CustomOrderModal'
import { TiltCard } from '@/components/motion/TiltCard'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { cn } from '@/lib/cn'

/** Огромные слова: заголовок из CMS в две строки (по словам) или фраза по умолчанию */
function displayLines(heading: string | null | undefined, fallback: string[]): string[] {
  const words = (heading ?? '').trim().split(/\s+/).filter(Boolean)
  if (!words.length || words.length > 3) return fallback
  if (words.length === 1) return words
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

export async function CTABlockView({ block, context }: { block: CTABlock; context: BlockContext }) {
  const t = await getTranslations('home')
  const variant = block.variant ?? 'blush'
  const product = context.product ? { id: context.product.id, title: context.product.title } : null

  // Контактная секция: огромные слова на plum + наклонённая карточка с формой обратной связи
  if (variant === 'plum' || block.action === 'contactForm') {
    return (
      <section className="mt-section" aria-labelledby={`cta-${block.id}`}>
        <div className="container-site">
          <div className="relative isolate overflow-hidden rounded-section bg-plum px-5 py-10 text-milk md:px-12 md:py-16">
            <StepReveal className="pointer-events-none absolute right-0 bottom-0 -z-10 w-[80%] max-w-[700px] opacity-60">
              <Terrace color="plum" tone steps={6} className="w-full" />
            </StepReveal>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <DisplayHeading as="h2" id={`cta-${block.id}`} lines={displayLines(block.heading, [t('contactLine1'), t('contactLine2')])} className="text-lavender" />
                {block.text && <p className="t-lead mt-3 max-w-[36ch] text-milk/85">{block.text}</p>}
                <p className="t-small mt-6 font-normal text-milk/75">{t('contactNote')}</p>
              </div>
              <div className="lg:col-span-6">
                <TiltCard tilt={-3} className="rounded-[24px] bg-paper p-5 text-ink shadow-float md:p-8">
                  <LazyContactForm />
                </TiltCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const bg = { pistachio: 'bg-pistachio', blush: 'bg-blush', lavender: 'bg-lavender', plum: 'bg-plum' }[variant]
  return (
    <section className="mt-section" aria-labelledby={`cta-${block.id}`}>
      <div className="container-site">
        <div className={cn('relative isolate grid gap-8 overflow-hidden rounded-section p-6 md:p-12 lg:grid-cols-12', bg)}>
          <StepReveal className="pointer-events-none absolute bottom-0 left-0 -z-10 w-[70%] max-w-[520px]">
            <Terrace color={variant === 'pistachio' ? 'pistachio' : variant === 'lavender' ? 'lavender' : 'blush'} tone steps={5} className="w-full" />
          </StepReveal>
          <div className={cn('flex flex-col gap-4', block.action === 'customForm' ? 'lg:col-span-5' : 'lg:col-span-8')}>
            <SplitHeading id={`cta-${block.id}`} className="t-h1">
              {block.heading ?? ''}
            </SplitHeading>
            {block.text && <p className="t-lead max-w-[38ch]">{block.text}</p>}
            {block.action !== 'customForm' && (
              <div className="mt-4">
                {block.action === 'customModal' ? (
                  <CustomOrderModalButton label={block.buttonLabel ?? ''} product={product} />
                ) : (
                  <TransitionLink href={(block.route as StaticPathname) ?? '/custom'} className={buttonClasses({ size: 'lg' })}>
                    {block.buttonLabel}
                    <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                  </TransitionLink>
                )}
              </div>
            )}
          </div>
          {block.action === 'customForm' && (
            <div className="lg:col-span-6 lg:col-start-7">
              <TiltCard tilt={2} className="rounded-[24px] bg-paper p-5 shadow-float md:p-8">
                <LazyCustomOrderForm variant="short" product={product} />
              </TiltCard>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import type { ImageDTO } from '@/lib/media'
import { Arch, Terrace } from '@/components/shapes'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { Tag } from '@/components/ui/Chip'
import { StepReveal } from '@/components/motion/StepReveal'

type Props = {
  lines: string[]
  chip?: string
  lead?: string
  image: ImageDTO | null
  variant: 'collection' | 'page' | 'home'
  priority?: boolean
  headingLevel?: 'h1' | 'h2'
  breadcrumbs?: React.ReactNode
}

/** Hero коллекции и контентных страниц: огромное название и фото в маске-арке */
export function PageHero({ lines, chip, lead, image, variant, priority, headingLevel = 'h1', breadcrumbs }: Props) {
  const longest = Math.max(4, ...lines.flatMap((l) => l.split(/\s+/)).map((w) => w.length))
  return (
    <section className="relative isolate overflow-hidden">
      <StepReveal immediate className="pointer-events-none absolute top-24 left-0 -z-10 w-[56vw] max-w-[560px] opacity-70">
        <Terrace color={variant === 'collection' ? 'blush' : 'mist'} steps={5} flip className="w-full" />
      </StepReveal>
      <div className="container-site grid gap-8 pt-6 pb-12 md:grid-cols-12 md:gap-6 md:pt-10 md:pb-16">
        <div className="flex flex-col justify-end gap-5 md:col-span-7" style={{ containerType: 'inline-size' }}>
          {breadcrumbs}
          {chip && (
            <div>
              <Tag tone="paper">{chip}</Tag>
            </div>
          )}
          <SplitHeading as={headingLevel} by="chars" immediate className="t-display">
            <span className="block" style={{ fontSize: `min(clamp(44px, 2.667px + 11vw, 168px), calc(100cqi / ${longest} / 0.94))` }}>
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </span>
          </SplitHeading>
          {lead && <p className="t-lead max-w-[38ch] text-ink-soft">{lead}</p>}
        </div>
        {image && (
          <div className="md:col-span-5 md:col-start-8">
            <Arch aspect="4 / 5" className="mx-auto max-w-[460px]">
              <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 768px) 40vw, 92vw" placeholder="blur" blurDataURL={image.blur} className="object-cover" />
            </Arch>
          </div>
        )}
      </div>
    </section>
  )
}

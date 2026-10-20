import type { StatsBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import type { StaticPathname } from '@/i18n/routing'
import { Stats } from './Stats'

export function StatsBlockView({ block }: { block: StatsBlock; context: BlockContext }) {
  const items = (block.items ?? []).map((i) => ({ value: i.value, suffix: i.suffix ?? '', label: i.label }))
  if (!items.length) return null
  return (
    <Stats
      heading={block.heading ?? ''}
      lead={block.lead ?? ''}
      items={items}
      link={block.route && block.linkLabel ? { href: block.route as StaticPathname, label: block.linkLabel } : null}
    />
  )
}

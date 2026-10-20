import type { RichTextBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { RichContent } from '@/components/ui/RichContent'

export function RichTextBlockView({ block }: { block: RichTextBlock; context: BlockContext }) {
  if (!block.content) return null
  return (
    <section className="mt-section">
      <div className="container-site">
        <RichContent data={block.content} />
      </div>
    </section>
  )
}

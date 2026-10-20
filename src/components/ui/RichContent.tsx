import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { slugify } from '@/lib/slug'
import { plainText } from '@/lib/richtext'
import { cn } from '@/lib/cn'

type Heading = { id: string; text: string; level: 2 | 3 }

/** Заголовки для оглавления (якоря — транслит текста заголовка) */
export function headingsOf(data: unknown): Heading[] {
  const root = (data as { root?: { children?: Array<{ type?: string; tag?: string }> } })?.root
  return (root?.children ?? [])
    .filter((n) => n.type === 'heading' && (n.tag === 'h2' || n.tag === 'h3'))
    .map((n) => {
      const text = plainText({ root: { children: [n] } })
      return { id: slugify(text), text, level: n.tag === 'h3' ? 3 : 2 }
    })
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = (node.tag === 'h1' ? 'h2' : node.tag) as 'h2' | 'h3' | 'h4'
    const text = plainText({ root: { children: [node] } })
    return (
      <Tag id={slugify(text)} className="scroll-mt-[calc(var(--header-h)+24px)]">
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
})

/** Рич-текст из CMS: санитизированный рендер Lexical JSON (без dangerouslySetInnerHTML) */
export function RichContent({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return <RichText data={data as SerializedEditorState} converters={converters} className={cn('prose-oblik', className)} disableContainer={false} />
}

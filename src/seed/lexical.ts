/** Мини-конструктор Lexical JSON для rich-text полей в демо-данных */
type Node = Record<string, unknown>

export type RichBlock = { h2: string } | { h3: string } | { p: string } | { ul: string[] } | { quote: string }

const text = (value: string): Node => ({ type: 'text', text: value, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

export function richText(blocks: RichBlock[]) {
  const children: Node[] = blocks.map((b) => {
    if ('h2' in b) return { ...base, type: 'heading', tag: 'h2', children: [text(b.h2)] }
    if ('h3' in b) return { ...base, type: 'heading', tag: 'h3', children: [text(b.h3)] }
    if ('quote' in b) return { ...base, type: 'quote', children: [text(b.quote)] }
    if ('ul' in b)
      return {
        ...base,
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        children: b.ul.map((item, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(item)] })),
      }
    return { ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(b.p)] }
  })
  return { root: { ...base, type: 'root', children } }
}

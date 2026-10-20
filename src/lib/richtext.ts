/** Плоский текст из Lexical JSON — для мета-описаний, оглавления, писем */
export function plainText(value: unknown): string {
  const walk = (n: unknown): string => {
    if (!n || typeof n !== 'object') return ''
    const node = n as { text?: string; children?: unknown[] }
    if (typeof node.text === 'string') return node.text
    return (node.children ?? []).map(walk).join(' ')
  }
  return walk((value as { root?: unknown })?.root).replace(/\s+/g, ' ').trim()
}

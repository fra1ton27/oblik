import { Fragment, type ReactNode } from 'react'

export const SLOT = '\u0000'

/**
 * Вставка React-узла в переведённую строку: t('consent', { link: SLOT }) → «… {link} …».
 * Переменная остаётся в словаре (перевод решает, где стоит ссылка), а разметка — в компоненте.
 */
export function withSlot(text: string, node: ReactNode): ReactNode {
  const [before, after = ''] = text.split(SLOT)
  return (
    <Fragment>
      {before}
      {node}
      {after}
    </Fragment>
  )
}

export const SLOTS = ['\u0000', '\u0001', '\u0002'] as const

/** Несколько узлов в одной строке: t('agree', { terms: SLOTS[0], privacy: SLOTS[1] }) */
export function withSlots(text: string, nodes: ReactNode[]): ReactNode {
  const parts = text.split(/([\u0000-\u0002])/)
  return (
    <Fragment>
      {parts.map((part, i) => {
        const idx = SLOTS.indexOf(part as (typeof SLOTS)[number])
        return <Fragment key={i}>{idx >= 0 ? nodes[idx] : part}</Fragment>
      })}
    </Fragment>
  )
}

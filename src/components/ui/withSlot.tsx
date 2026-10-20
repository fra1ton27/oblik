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

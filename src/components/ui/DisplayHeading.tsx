import { cn } from '@/lib/cn'

type Props = {
  /** Строки заголовка: каждая с новой строки */
  lines: string[]
  as?: 'h1' | 'h2' | 'p'
  className?: string
  id?: string
}

/**
 * Огромная дисплейная типографика без горизонтального скролла: кегль ограничен шириной
 * контейнера и длиной самого длинного слова (container query units), поэтому «UDOBNOST»
 * на 360 px не рвётся посреди слова. text-wrap: balance и hyphens: auto — из t-display.
 */
export function DisplayHeading({ lines, as: Tag = 'h1', className, id }: Props) {
  const longest = Math.max(4, ...lines.flatMap((l) => l.split(/\s+/)).map((w) => w.length))
  return (
    <div className="w-full" style={{ containerType: 'inline-size' }}>
      <Tag
        id={id}
        className={cn('t-display', className)}
        style={{ fontSize: `min(clamp(44px, 2.667px + 13.704vw, 200px), calc(100cqi / ${longest} / 0.94))` }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    </div>
  )
}

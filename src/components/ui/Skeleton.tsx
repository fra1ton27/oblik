import { cn } from '@/lib/cn'

export function Skeleton({ className, rounded = 'card' }: { className?: string; rounded?: 'card' | 'pill' | 'field' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block bg-sand motion-safe:animate-[skeleton_1.6s_ease-in-out_infinite]',
        { card: 'rounded-card', pill: 'rounded-pill', field: 'rounded-field' }[rounded],
        className,
      )}
    />
  )
}

/** Скелетон карточки товара: фото 4:5 + две строки */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-4 w-3/4" rounded="pill" />
      <Skeleton className="h-4 w-1/3" rounded="pill" />
    </div>
  )
}

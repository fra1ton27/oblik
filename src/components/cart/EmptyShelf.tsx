import { StepReveal } from '@/components/motion/StepReveal'

/** Пустая корзина: ступени складываются в силуэт пустой полки (каждая ступень проявляется по очереди) */
export function EmptyShelf({ className }: { className?: string }) {
  const cols = 5
  const w = 40
  return (
    <StepReveal immediate className={className}>
      <svg viewBox="0 0 220 180" className="h-auto w-full" aria-hidden>
        {/* вертикальные стойки и полки как ступени */}
        {Array.from({ length: cols }, (_, i) => (
          <rect key={`c${i}`} data-step x={10 + i * w} y={170 - (i + 1) * 30} width={w - 4} height={(i + 1) * 30} rx={4} fill="var(--color-lavender)" />
        ))}
        {[0, 1, 2].map((r) => (
          <rect key={`s${r}`} data-step x={10} y={50 + r * 40} width={196} height={6} rx={3} fill="var(--color-ink)" opacity={0.85} />
        ))}
        <rect data-step x={8} y={10} width={6} height={162} rx={3} fill="var(--color-ink)" />
        <rect data-step x={202} y={10} width={6} height={162} rx={3} fill="var(--color-ink)" />
      </svg>
    </StepReveal>
  )
}

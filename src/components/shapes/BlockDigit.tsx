// Цифры из «ступенчатых» блоков на сетке 3 × 5 (404, 500)
const DIGITS: Record<string, string[]> = {
  '0': ['111', '1.1', '1.1', '1.1', '111'],
  '4': ['1.1', '1.1', '111', '..1', '..1'],
  '5': ['111', '1..', '111', '..1', '111'],
}

/** Цифра из скруглённых квадратиков; у каждого data-step — их можно проявлять по очереди (StepReveal) */
export function BlockDigit({ char, tone }: { char: keyof typeof DIGITS | string; tone: string }) {
  const rows = DIGITS[char] ?? DIGITS['0']
  return (
    <svg viewBox="0 0 30 50" className="h-auto w-full" aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '1' ? <rect key={`${x}-${y}`} data-step x={x * 10 + 0.5} y={y * 10 + 0.5} width={9} height={9} rx={2} fill={tone} /> : null,
        ),
      )}
    </svg>
  )
}

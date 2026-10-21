import { DemoSeedButton } from './DemoSeedButton'

type Props = { user?: { collection?: string; role?: string } | null }

/**
 * Дашборд админки: загрузка демо-данных там, где нет командной строки (Netlify, README).
 * Видна только администратору и только при ALLOW_DEMO_SEED=1.
 */
export function DemoSeed({ user }: Props) {
  if (process.env.ALLOW_DEMO_SEED !== '1') return null
  if (user?.collection !== 'users' || user.role !== 'admin') return null
  return <DemoSeedButton />
}

import { notFound } from 'next/navigation'

// Любой неизвестный путь внутри локали → локализованная 404 из [locale]/not-found.tsx
export default function CatchAllPage() {
  notFound()
}

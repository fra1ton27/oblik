import { SiteChrome } from '@/components/layout/SiteChrome'

/** Оформление: шапка не прячется, подвал упрощённый (только нижняя полоса с копирайтом и @fra1ton27) */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome variant="checkout">{children}</SiteChrome>
}

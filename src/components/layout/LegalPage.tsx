import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale, StaticPathname } from '@/i18n/routing'
import { getPageByKey, type PageKey } from '@/lib/data/pages'
import { formatDate } from '@/lib/format'
import { fitToLongestWord } from '@/lib/typography'
import { pageMetadata } from '@/lib/seo'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Tag } from '@/components/ui/Chip'
import { RichContent, headingsOf } from '@/components/ui/RichContent'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TocNav } from './TocNav'

type Params = { params: Promise<{ locale: Locale }> }

/** Метаданные контентной страницы из CMS: SEO-поля плагина, иначе заголовок и вступление */
export async function contentPageMetadata(key: PageKey, route: StaticPathname, { params }: Params): Promise<Metadata> {
  const { locale } = await params
  const page = await getPageByKey(key, locale)
  if (!page) return {}
  const meta = (page as { meta?: { title?: string | null; description?: string | null } }).meta
  return pageMetadata({ locale, route, title: meta?.title || page.title, description: meta?.description || page.intro || undefined })
}

/**
 * Политика, условия, доставка и оплата (раздел 10.3 ТЗ): рич-текст из коллекции pages,
 * оглавление по заголовкам, дата обновления и пометка «требует проверки юристом».
 */
export async function LegalPage({ pageKey, params }: { pageKey: PageKey } & Params) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getPageByKey(pageKey, locale)
  if (!page) notFound()
  const t = await getTranslations('pages')
  const tn = await getTranslations('nav')
  const toc = headingsOf(page.content)

  return (
    <div className="container-site pt-6 pb-10 md:pt-10">
      <Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: page.title }]} />
      <header className="mt-4 max-w-4xl" style={{ containerType: 'inline-size' }}>
        <SplitHeading as="h1" by="chars" immediate className="t-h1">
          <span className="block" style={fitToLongestWord(page.title, 'clamp(32px, 16px + 5.556vw, 96px)')}>
            {page.title}
          </span>
        </SplitHeading>
        {page.intro && <p className="t-lead mt-4 max-w-[60ch] text-ink-soft">{page.intro}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Tag tone="paper">{t('updated', { date: formatDate(page.updatedAt, locale) })}</Tag>
          {page.needsLegalReview && <Tag tone="blush">{t('legalReview')}</Tag>}
        </div>
      </header>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {toc.length > 0 && (
          <aside className="min-w-0 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <TocNav items={toc} />
            </div>
          </aside>
        )}
        <article className="min-w-0 lg:col-span-8 lg:col-start-5">
          <RichContent data={page.content} />
        </article>
      </div>
      <RenderBlocks blocks={page.layout} context={{ locale, page: 'page' }} />
    </div>
  )
}

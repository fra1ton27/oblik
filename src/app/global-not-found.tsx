/* eslint-disable @next/next/no-html-link-for-pages -- переход в другой root layout всё равно полная загрузка */
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { createTranslator } from 'next-intl'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'
import sr from '../../messages/sr.json'
import { fontVariables } from './(frontend)/fonts'
import { site } from '@/config/site'

export const metadata: Metadata = {
  title: `404 — ${site.name}`,
  robots: { index: false, follow: false },
}

// Путь вне известных маршрутов (до локали). Показываем русскую версию со ссылками на все языки.
export default function GlobalNotFound() {
  const t = createTranslator({ locale: 'ru', messages: ru })
  const tEn = createTranslator({ locale: 'en', messages: en })
  const tSr = createTranslator({ locale: 'sr', messages: sr })
  return (
    <html lang="ru" className={fontVariables}>
      <body className="flex min-h-svh flex-col bg-milk text-ink">
        <main id="main" className="container-site flex flex-1 flex-col justify-center py-16">
          <p className="t-display" aria-hidden>
            404
          </p>
          <h1 className="t-h2 mt-6 max-w-3xl">{t('errors.notFoundTitle')}</h1>
          <nav className="mt-10 flex flex-wrap gap-3" aria-label={t('common.languageSwitcher')}>
            <a className="tap inline-flex items-center rounded-pill bg-ink px-6 text-milk" href="/ru">
              {t('nav.home')}
            </a>
            <a className="tap inline-flex items-center rounded-pill border border-ink px-6" href="/en" lang="en">
              {tEn('nav.home')}
            </a>
            <a className="tap inline-flex items-center rounded-pill border border-ink px-6" href="/sr" lang="sr-Latn">
              {tSr('nav.home')}
            </a>
          </nav>
        </main>
        <footer className="container-site flex flex-col gap-2 border-t border-line py-6 t-small sm:flex-row sm:justify-between">
          <span>{t('footer.copyright', { year: new Date().getFullYear(), brand: site.name })}</span>
          <span>
            {t('footer.credit', { handle: '' })}
            <a href={site.developer.url} target="_blank" rel="noopener" className="underline underline-offset-4">
              {site.developer.handle}
            </a>
          </span>
        </footer>
      </body>
    </html>
  )
}

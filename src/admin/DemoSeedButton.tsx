'use client'

import { Button, useTranslation } from '@payloadcms/ui'
import { useState } from 'react'

// Тексты админки, как и подписи коллекций, — ru/en прямо в коде (словари messages — для сайта)
const TEXT = {
  ru: {
    title: 'Демо-данные',
    hint: 'Товары, коллекции, страницы и картинки для показа сайта. Уже существующие записи не меняются.',
    run: 'Загрузить демо-данные',
    running: (step: number) => `Загружаю, шаг ${step}…`,
    done: 'Готово. Запустите новый деплой на Netlify, чтобы статические страницы собрались с данными.',
    error: (detail: string) => `Не получилось: ${detail}. Нажмите ещё раз — seed продолжит с места остановки.`,
  },
  en: {
    title: 'Demo data',
    hint: 'Products, collections, pages and images to showcase the site. Existing records are left untouched.',
    run: 'Load demo data',
    running: (step: number) => `Loading, step ${step}…`,
    done: 'Done. Trigger a new Netlify deploy so static pages are rebuilt with the data.',
    error: (detail: string) => `Failed: ${detail}. Press again — the seed resumes where it stopped.`,
  },
}

// на Netlify шаг — 15 с, а картинки там собираются медленно: полный seed занимает десятки шагов
const MAX_STEPS = 150

type State = { status: 'idle' | 'running' | 'done' | 'error'; step: number; detail?: string }

/** Вызывает POST /api/demo-seed, пока сервер не ответит done (каждый вызов укладывается в лимит функции) */
export function DemoSeedButton() {
  const { i18n } = useTranslation()
  const t = TEXT[i18n.language === 'en' ? 'en' : 'ru']
  const [state, setState] = useState<State>({ status: 'idle', step: 0 })

  async function run() {
    for (let step = 1; step <= MAX_STEPS; step++) {
      setState({ status: 'running', step })
      try {
        const res = await fetch('/api/demo-seed', { method: 'POST', credentials: 'include' })
        if (!res.ok) return setState({ status: 'error', step, detail: `HTTP ${res.status}` })
        const result = (await res.json()) as { done: boolean }
        if (result.done) return setState({ status: 'done', step })
      } catch (error) {
        return setState({ status: 'error', step, detail: error instanceof Error ? error.message : String(error) })
      }
    }
    setState({ status: 'error', step: MAX_STEPS, detail: `${MAX_STEPS}+` })
  }

  const message =
    state.status === 'running' ? t.running(state.step) : state.status === 'done' ? t.done : state.status === 'error' ? t.error(state.detail ?? '') : t.hint

  return (
    <section style={{ marginBottom: 'var(--base)', padding: 'var(--base)', border: '1px solid var(--theme-elevation-150)', borderRadius: 'var(--style-radius-m)' }}>
      <h3 style={{ margin: 0 }}>{t.title}</h3>
      <p role="status" style={{ margin: 'calc(var(--base) / 2) 0' }}>
        {message}
      </p>
      <Button buttonStyle="secondary" disabled={state.status === 'running'} onClick={run} margin={false}>
        {t.run}
      </Button>
    </section>
  )
}

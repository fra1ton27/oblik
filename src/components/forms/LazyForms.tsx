'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { site } from '@/config/site'
import type { ContactForm } from './ContactForm'
import type { CustomOrderForm } from './CustomOrderForm'
import type { NewsletterForm } from './NewsletterForm'
import type { QuestionForm } from './QuestionForm'

/**
 * Формы тянут zod, react-hook-form и libphonenumber (~90 КБ gzip). Чтобы они не входили в JS первой
 * загрузки (бюджет 200 КБ, раздел 13 ТЗ), код формы грузится, когда она подходит к экрану,
 * а в модалках — при первом открытии. Без JS вместо формы — ссылка на почту.
 */
const Contact = dynamic(() => import('./ContactForm').then((m) => m.ContactForm), { ssr: false })
const Custom = dynamic(() => import('./CustomOrderForm').then((m) => m.CustomOrderForm), { ssr: false })
const Newsletter = dynamic(() => import('./NewsletterForm').then((m) => m.NewsletterForm), { ssr: false })
const Question = dynamic(() => import('./QuestionForm').then((m) => m.QuestionForm), { ssr: false })

function NoScript() {
  const t = useTranslations('forms')
  return (
    <noscript>
      <p className="t-small flex flex-wrap gap-x-1.5">
        <span>{t('noscript')}</span>
        <a href={`mailto:${site.contacts.email}`} className="font-semibold underline underline-offset-4">
          {site.contacts.email}
        </a>
      </p>
    </noscript>
  )
}

/** Рендерит детей, когда блок в 600 px от экрана; до этого держит место (без скачка вёрстки) */
function OnVisible({ minHeight, children }: { minHeight: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setVisible(true), { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible ? children : <NoScript />}
    </div>
  )
}

export function LazyContactForm(props: ComponentProps<typeof ContactForm>) {
  return (
    <OnVisible minHeight={620}>
      <Contact {...props} />
    </OnVisible>
  )
}

export function LazyCustomOrderForm(props: ComponentProps<typeof CustomOrderForm>) {
  return (
    <OnVisible minHeight={props.variant === 'short' ? 520 : 1100}>
      <Custom {...props} />
    </OnVisible>
  )
}

export function LazyNewsletterForm(props: ComponentProps<typeof NewsletterForm>) {
  return (
    <OnVisible minHeight={150}>
      <Newsletter {...props} />
    </OnVisible>
  )
}

/** Для модалок: форма грузится при первом открытии и остаётся (введённое не теряется при закрытии) */
export function DeferredCustomOrderForm({ open, ...props }: ComponentProps<typeof CustomOrderForm> & { open: boolean }) {
  const [opened, setOpened] = useState(open)
  if (open && !opened) setOpened(true)
  return opened ? <Custom {...props} /> : null
}

export function DeferredQuestionForm({ open, ...props }: ComponentProps<typeof QuestionForm> & { open: boolean }) {
  const [opened, setOpened] = useState(open)
  if (open && !opened) setOpened(true)
  return opened ? <Question {...props} /> : null
}

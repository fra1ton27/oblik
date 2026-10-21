import { Terrace } from '@/components/shapes/Terrace'
import { TiltCard } from '@/components/motion/TiltCard'

/**
 * Страницы входа, регистрации и восстановления (раздел 9.1 ТЗ): форма на наклонённой карточке paper
 * поверх секции lavender со ступенчатым фоном. На мобайле карточка без наклона на всю ширину.
 */
export function AuthShell({ title, lead, notice, children }: { title: React.ReactNode; lead?: React.ReactNode; notice?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="container-site pt-6 pb-10 md:pt-10">
      <section className="relative isolate overflow-hidden rounded-section bg-lavender px-2 py-8 sm:px-6 md:px-10 md:py-16">
        {/* на мобайле шейп только сверху: снизу форма на всю ширину */}
        <Terrace color="lavender" tone steps={6} unit={9} flip className="absolute bottom-0 left-0 -z-10 hidden h-[62%] w-auto max-w-[80%] md:block" />
        <Terrace color="lavender" tone steps={4} unit={6} className="absolute top-0 right-0 -z-10 h-[120px] w-auto rotate-180 md:h-[30%]" />
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="px-3 sm:px-0 lg:col-span-5">
            <h1 className="t-h1">{title}</h1>
            {lead && <p className="t-lead mt-4 max-w-[46ch] text-ink-soft">{lead}</p>}
          </div>
          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <TiltCard tilt={-2} mobileTilt={0} className="rounded-card bg-paper p-5 shadow-float sm:p-8">
              {notice}
              {children}
            </TiltCard>
          </div>
        </div>
      </section>
    </div>
  )
}

/** Плашка-уведомление над формой (подтверждение email, ошибка ссылки) */
export function AuthNotice({ tone = 'success', children }: { tone?: 'success' | 'error'; children: React.ReactNode }) {
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={tone === 'error' ? 'mb-5 rounded-card border border-error bg-paper p-4 text-[14px] font-semibold text-error' : 'mb-5 rounded-card bg-pistachio p-4 text-[14px] font-semibold'}>
      {children}
    </p>
  )
}

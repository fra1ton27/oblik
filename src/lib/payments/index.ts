/**
 * Платёжный адаптер. В MVP — ручная оплата: менеджер подтверждает заказ и выставляет счёт
 * или договаривается об оплате при получении. Онлайн-провайдер подключается реализацией
 * того же интерфейса без переделки оформления заказа.
 */
export type PaymentOrder = { id: number | string; number: string; total: number; currency: string; locale: string; email: string }

export type InitiateResult = { status: 'pending' } | { status: 'redirect'; url: string }

export interface PaymentProvider {
  id: 'manual' | 'card'
  /** Начать оплату сразу после создания заказа */
  initiate(order: PaymentOrder): Promise<InitiateResult>
  /** Подтвердить оплату (вручную из админки или по ответу провайдера) */
  confirm(orderId: number | string, payload?: unknown): Promise<{ paid: boolean }>
  /** Вебхук провайдера: проверка подписи и смена paymentStatus */
  handleWebhook(request: Request): Promise<Response>
}

export const ManualPaymentProvider: PaymentProvider = {
  id: 'manual',
  async initiate() {
    // Ничего не списываем: paymentStatus остаётся pending до подтверждения менеджером
    return { status: 'pending' }
  },
  async confirm() {
    return { paid: true }
  },
  async handleWebhook() {
    return new Response('manual provider has no webhooks', { status: 404 })
  },
}

/** TODO(spec): выбрать онлайн-провайдера (раздел 15.2) и реализовать CardPaymentProvider */
export function getPaymentProvider(method: string): PaymentProvider {
  if (method === 'manual') return ManualPaymentProvider
  return ManualPaymentProvider
}

import type { Locale } from './routing'

/**
 * Тексты для global-error: он заменяет корневой layout, провайдера next-intl там нет,
 * а импорт целых messages/*.json раздул бы клиентский бандл каждой страницы.
 * Это копия ключей errors.serverTitle / serverText / retry / toHome и footer.credit —
 * тест tests/unit/fallback.test.ts следит, чтобы она не разошлась со словарями.
 */
export const fallbackTexts: Record<Locale, { serverTitle: string; serverText: string; retry: string; toHome: string; credit: string }> = {
  ru: {
    serverTitle: 'Что-то пошло не так',
    serverText: 'Мы уже знаем об ошибке и чиним её. Попробуйте обновить страницу через минуту.',
    retry: 'Попробовать снова',
    toHome: 'На главную',
    credit: 'Дизайн и разработка — {handle}',
  },
  en: {
    serverTitle: 'Something went wrong',
    serverText: 'We already know about the error and are fixing it. Please try refreshing the page in a minute.',
    retry: 'Try again',
    toHome: 'Go home',
    credit: 'Design & development by {handle}',
  },
  sr: {
    serverTitle: 'Nešto je pošlo naopako',
    serverText: 'Već znamo za grešku i popravljamo je. Pokušajte da osvežite stranicu za minut.',
    retry: 'Pokušaj ponovo',
    toHome: 'Na početnu',
    credit: 'Dizajn i razvoj — {handle}',
  },
}

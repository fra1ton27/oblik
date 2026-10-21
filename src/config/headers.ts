/**
 * Заголовок, через который proxy.ts передаёт серверным компонентам текущий путь с query
 * (у layout нет pathname, а кабинету он нужен для returnTo). Клиентское значение перезаписывается.
 */
export const PATH_HEADER = 'x-oblik-path'

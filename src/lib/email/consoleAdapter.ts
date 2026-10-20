import type { EmailAdapter } from 'payload'

/**
 * Без ключа почты письма пишутся в консоль сервера,
 * чтобы проект запускался локально без внешних сервисов.
 */
export function consoleEmailAdapter(defaults: {
  fromAddress: string
  fromName: string
}): EmailAdapter {
  return () => ({
    name: 'console',
    defaultFromAddress: defaults.fromAddress,
    defaultFromName: defaults.fromName,
    async sendEmail(message) {
      const to = Array.isArray(message.to) ? message.to.join(', ') : String(message.to ?? '')
      const text =
        typeof message.text === 'string'
          ? message.text
          : typeof message.html === 'string'
            ? message.html
                .replace(/<style[\s\S]*?<\/style>/g, '')
                .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '$2 <$1>')
                .replace(/<br\s*\/?>/g, '\n')
                .replace(/<\/(p|h1|h2|h3|tr|li|div)>/g, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/\n{3,}/g, '\n\n')
                .trim()
            : ''
      console.log(
        [
          '',
          '┌─ ✉  email (console) ─────────────────────────────',
          `│ to:      ${to}`,
          `│ subject: ${message.subject ?? ''}`,
          '├──────────────────────────────────────────────────',
          ...text.split('\n').map((line) => `│ ${line}`),
          '└──────────────────────────────────────────────────',
          '',
        ].join('\n'),
      )
      return { ok: true }
    },
  })
}

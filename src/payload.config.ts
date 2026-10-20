import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig, type EmailAdapter } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { ru } from '@payloadcms/translations/languages/ru'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'

import { site } from './config/site'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { consoleEmailAdapter } from './lib/email/consoleAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function parseFrom(value: string | undefined) {
  const match = /^(.*)<(.+)>$/.exec(value ?? '')
  if (match) return { fromName: match[1].trim() || site.name, fromAddress: match[2].trim() }
  return { fromName: site.name, fromAddress: value || 'hello@oblik.example' }
}

function emailAdapter(): EmailAdapter {
  const { fromAddress, fromName } = parseFrom(process.env.MAIL_FROM)
  if (process.env.RESEND_API_KEY) {
    return resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
    }) as EmailAdapter
  }
  if (process.env.SMTP_HOST) {
    return nodemailerAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    }) as unknown as EmailAdapter
  }
  return consoleEmailAdapter({ fromAddress, fromName })
}

export default buildConfig({
  serverURL: site.url,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ` — ${site.name} admin` },
  },
  i18n: {
    supportedLanguages: { ru, en },
    fallbackLanguage: 'ru',
  },
  localization: {
    locales: [
      { code: 'ru', label: 'Русский' },
      { code: 'en', label: 'English' },
      { code: 'sr', label: 'Srpski' },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  email: emailAdapter(),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: { disable: true },
  telemetry: false,
})

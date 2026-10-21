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
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { s3Storage } from '@payloadcms/storage-s3'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Files } from './collections/Files'
import { Customers } from './collections/Customers'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { ProductCollections } from './collections/ProductCollections'
import { Materials } from './collections/Materials'
import { Designers } from './collections/Designers'
import { Reviews } from './collections/Reviews'
import { Orders } from './collections/Orders'
import { Carts } from './collections/Carts'
import { Inquiries } from './collections/Inquiries'
import { PromoCodes } from './collections/PromoCodes'
import { Pages } from './collections/Pages'
import { globals } from './globals'
import { consoleEmailAdapter } from './lib/email/consoleAdapter'
import { ensureSequences } from './lib/sequences'
import { isContentEditor } from './lib/access'
import { netlifyBlobsStorage } from './lib/storage/netlifyBlobs'
import { demoSeedEndpoint } from './seed/endpoint'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// На Netlify (next.config.ts выставляет при сборке) загрузки живут в Netlify Blobs: у функций нет постоянного диска
const onNetlify = process.env.OBLIK_STORAGE === 'netlify-blobs'

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
    components: {
      // демо-данные из админки, когда нет командной строки (Netlify); видна при ALLOW_DEMO_SEED=1
      beforeDashboard: ['/admin/DemoSeed#DemoSeed'],
    },
  },
  endpoints: [demoSeedEndpoint],
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
  collections: [
    Products,
    Categories,
    ProductCollections,
    Materials,
    Designers,
    Reviews,
    Orders,
    Inquiries,
    Customers,
    Carts,
    PromoCodes,
    Pages,
    Media,
    Files,
    Users,
  ],
  globals,
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // dev синхронизирует схему push'ем; production — только миграциями, отдельным шагом до старта
    // приложения (`pnpm payload migrate`, в Docker — сервис migrate). Не prodMigrations: тогда `pnpm start`
    // на dev-базе после push'а спрашивал бы подтверждение и завершал процесс.
    // После изменения коллекций: pnpm payload migrate:create <name> и коммит src/migrations.
  }),
  email: emailAdapter(),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: { disable: true },
  telemetry: false,
  onInit: async (payload) => {
    await ensureSequences(payload)
  },
  plugins: [
    // включён только на Netlify, но поля prefix/_objectKey добавляет всегда — схема одна для всех окружений
    netlifyBlobsStorage({
      enabled: onNetlify,
      collections: {
        ...(process.env.S3_BUCKET ? {} : { media: { store: 'media', cacheControl: 'public, max-age=86400' } }),
        files: { store: 'private-files', cacheControl: 'private, no-store' },
      },
    }),
    seoPlugin({
      collections: ['products', 'collections', 'categories', 'pages'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${(doc as { title?: string })?.title ?? ''} — ${site.name}`,
      generateDescription: ({ doc }) => ((doc as { shortDescription?: string })?.shortDescription ?? '').slice(0, 160),
    }),
    redirectsPlugin({
      collections: ['products', 'categories', 'collections', 'pages'],
      overrides: {
        admin: { group: { ru: 'Сайт', en: 'Site' } },
        access: { read: () => true, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
      },
    }),
    // В prod медиа можно хранить в S3-совместимом хранилище (если заданы S3_*)
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT || undefined,
              forcePathStyle: Boolean(process.env.S3_ENDPOINT),
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
            },
          }),
        ]
      : []),
  ],
})

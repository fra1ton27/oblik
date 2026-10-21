import { getStore, type Store } from '@netlify/blobs'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import type { Adapter, CollectionOptions } from '@payloadcms/plugin-cloud-storage/types'
import { getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities'
import type { Plugin, UploadCollectionSlug } from 'payload'
import { getRangeRequestInfo, isXmlMimeType, UPLOAD_CONTENT_SECURITY_POLICY } from 'payload/internal'

/**
 * Загрузки Payload в Netlify Blobs (деплой на Netlify, README): у функций Netlify нет постоянного диска.
 * Ключ объекта — путь файла из плагина cloud-storage, тип файла — в метаданных объекта.
 *
 * Плагин подключается всегда: вне Netlify он выключен, но с alwaysInsertFields добавляет в коллекции
 * поля prefix и _objectKey, поэтому схема и миграции одинаковы в любом окружении.
 */

type StoreOptions = {
  /** имя хранилища Netlify Blobs */
  store: string
  /** Cache-Control ответа: медиатека публичная, вложения заявок — нет */
  cacheControl: string
}

type Meta = { contentType?: string }

const plain = (text: string, status: number, headers?: Headers) => {
  const h = new Headers(headers)
  h.set('Content-Type', 'text/plain; charset=utf-8')
  return new Response(text, { headers: h, status })
}

/**
 * fetch для клиента Blobs внутри Next. Next отдаёт тело ответа как ветку tee(), и её cancel() ждёт вторую
 * ветку — а клиент Blobs отменяет тело у ответов 404 и при удалении, так что запрос повисал (проверено
 * с локальным сервером Blobs). Поэтому тело читаем целиком и отдаём обычную копию; cache: 'no-store' —
 * чтобы файлы не попадали в кэш данных Next.
 */
const blobsFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, { ...init, cache: 'no-store' })
  const body = [204, 205, 304].includes(res.status) ? null : await res.arrayBuffer()
  return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers })
}

function blobsAdapter({ store: name, cacheControl }: StoreOptions): Adapter {
  return ({ collection }) => {
    let store: Store | undefined
    // контекст Netlify читается при первом обращении: при сборке схемы вне Netlify хранилище не нужно
    const blobs = () => (store ??= getStore({ name, consistency: 'strong', fetch: blobsFetch }))
    const sizes = typeof collection.upload === 'object' ? (collection.upload.imageSizes ?? []) : []

    return {
      name: 'netlify-blobs',
      handleUpload: async ({ file, storageFilePath }) => {
        const { buffer, byteOffset, byteLength } = file.buffer
        const body = buffer.slice(byteOffset, byteOffset + byteLength) as ArrayBuffer
        await blobs().set(storageFilePath, body, { metadata: { contentType: file.mimeType } satisfies Meta })
      },
      handleDelete: async ({ storageFilePath }) => {
        await blobs().delete(storageFilePath)
      },
      staticHandler: async (req, { doc, headers: incoming, params: { clientUploadContext, filename } }) => {
        try {
          // нет записи — нет и файла: в хранилище не ходим (ссылки ботов, старые адреса)
          if (!doc) {
            const where = { or: [{ filename: { equals: filename } }, ...sizes.map((s) => ({ [`sizes.${s.name}.filename`]: { equals: filename } }))] }
            const found = await req.payload.count({ collection: collection.slug as UploadCollectionSlug, where, overrideAccess: false, req })
            if (!found.totalDocs) return plain('Not Found', 404)
          }
          const key = await getStorageFilePath({ clientUploadContext, collection, doc: doc as never, filename, req })
          const entry = await blobs().getWithMetadata(key, { type: 'arrayBuffer' })
          if (!entry) return plain('Not Found', 404)

          const contentType = (entry.metadata as Meta).contentType ?? 'application/octet-stream'
          let headers = new Headers(incoming)
          headers.set('Content-Type', contentType)
          headers.set('Cache-Control', cacheControl)
          if (entry.etag) headers.set('ETag', entry.etag)
          if (isXmlMimeType(contentType)) headers.set('Content-Security-Policy', UPLOAD_CONTENT_SECURITY_POLICY)
          if (typeof collection.upload === 'object' && typeof collection.upload.modifyResponseHeaders === 'function') {
            headers = collection.upload.modifyResponseHeaders({ headers }) || headers
          }

          const range = getRangeRequestInfo({ fileSize: entry.data.byteLength, rangeHeader: req.headers.get('range') })
          for (const [name, value] of Object.entries(range.headers)) headers.set(name, value)
          if (range.type === 'invalid') return plain('Range Not Satisfiable', range.status, headers)
          const body = range.type === 'partial' ? entry.data.slice(range.rangeStart, range.rangeEnd + 1) : entry.data
          return new Response(body, { headers, status: range.status })
        } catch (error) {
          req.payload.logger.error({ err: error, msg: `netlify-blobs: не удалось отдать ${filename}` })
          return plain('Internal Server Error', 500)
        }
      },
    }
  }
}

export function netlifyBlobsStorage({
  enabled,
  collections,
}: {
  enabled: boolean
  collections: Partial<Record<UploadCollectionSlug, StoreOptions>>
}): Plugin {
  return cloudStoragePlugin({
    enabled,
    alwaysInsertFields: true,
    collections: Object.fromEntries(
      Object.entries(collections).map(([slug, options]) => [slug, { adapter: blobsAdapter(options!) } satisfies CollectionOptions]),
    ),
  })
}

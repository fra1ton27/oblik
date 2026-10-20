import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Payload Local API в Server Components: без лишних HTTP-запросов */
export function getPayloadClient() {
  return getPayload({ config })
}

import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/** Навигация только через эти обёртки, не через next/link напрямую */
export const { Link, redirect, usePathname, useRouter, getPathname, permanentRedirect } =
  createNavigation(routing)

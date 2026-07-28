import { useLocation, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'

/** Incremental-migration shim for next/navigation's usePathname. */
export const usePathname = (): string =>
  useLocation({ select: (location) => location.pathname })

/** Minimal next/navigation useSearchParams shim (read-only). */
export const useSearchParams = (): { get: (name: string) => string | null } => {
  const search = useSearch({ strict: false }) as Record<string, unknown>

  return useMemo(
    () => ({
      get: (name: string) =>
        typeof search[name] === 'string' ? (search[name] as string) : null,
    }),
    [search],
  )
}

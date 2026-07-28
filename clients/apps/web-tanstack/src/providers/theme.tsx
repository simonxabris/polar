'use client'

import { usePathname, useSearchParams } from '@/hooks/navigation'
import { ThemeProvider } from 'next-themes'

const FORCED_DARK_PREFIXES = [
  '/features',
  '/customers',
  '/blog',
  '/resources',
  '/company',
  '/startup-program',
  '/downloads',
  '/legal',
]

const isForcedDarkPath = (pathname: string): boolean =>
  pathname === '/' ||
  FORCED_DARK_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

export function PolarThemeProvider({
  children,
  forceTheme,
}: {
  children: React.ReactNode
  forceTheme?: 'light' | 'dark'
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const theme = searchParams.get('theme')

  const forcedTheme = isForcedDarkPath(pathname) ? 'dark' : forceTheme

  return (
    <ThemeProvider
      defaultTheme="system"
      enableSystem
      attribute="class"
      forcedTheme={theme ?? forcedTheme}
    >
      {children}
    </ThemeProvider>
  )
}

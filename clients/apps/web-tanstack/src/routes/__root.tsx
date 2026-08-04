import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles/globals.css?url'

import { Toaster } from '@/components/Toast/Toaster'
import { PolarPostHogProvider } from '@/providers/posthog'
import { PolarThemeProvider } from '@/providers/theme'
import { CONFIG } from '@/utils/config'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const FONT_PRELOADS: Array<{ href: string; type: string }> = [
  { href: '/fonts/Inter-Light.woff2', type: 'font/woff2' },
  { href: '/fonts/Inter-Regular.woff2', type: 'font/woff2' },
  { href: '/fonts/Inter-Medium.woff2', type: 'font/woff2' },
  { href: '/fonts/Inter-SemiBold.woff2', type: 'font/woff2' },
  { href: '/fonts/InterDisplay-Light.woff2', type: 'font/woff2' },
  { href: '/fonts/InterDisplay-Regular.woff2', type: 'font/woff2' },
  { href: '/fonts/InterDisplay-Medium.woff2', type: 'font/woff2' },
  { href: '/fonts/InterDisplay-SemiBold.woff2', type: 'font/woff2' },
  { href: '/fonts/Louize-Italic-205TF.otf', type: 'font/otf' },
  { href: '/fonts/GeistMono-Variable.woff2', type: 'font/woff2' },
]

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      // StyleX CSS is collected by @stylexjs/unplugin and served at a
      // well-known endpoint in dev; appended to the built CSS in prod.
      ...(import.meta.env.DEV
        ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }]
        : []),
      ...(CONFIG.ENVIRONMENT === 'development'
        ? [
            {
              rel: 'icon',
              href: '/favicon-dev.png',
              media: '(prefers-color-scheme: dark)',
            },
            {
              rel: 'icon',
              href: '/favicon-dev-dark.png',
              media: '(prefers-color-scheme: light)',
            },
          ]
        : [
            {
              rel: 'icon',
              href: '/favicon.png',
              media: '(prefers-color-scheme: dark)',
            },
            {
              rel: 'icon',
              href: '/favicon-dark.png',
              media: '(prefers-color-scheme: light)',
            },
          ]),
      ...FONT_PRELOADS.map(({ href, type }) => ({
        rel: 'preload',
        href,
        as: 'font' as const,
        type,
        crossOrigin: 'anonymous' as const,
      })),
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Live-reload StyleX CSS in dev (see @stylexjs/unplugin).
    if (import.meta.env.DEV) {
      void import('virtual:stylex:runtime')
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <PolarPostHogProvider>
          <PolarThemeProvider>
            <div className="dark:bg-polar-950 h-full bg-white dark:text-white">
              {children}
            </div>
            <Toaster />
          </PolarThemeProvider>
        </PolarPostHogProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

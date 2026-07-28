'use client'

import { cookieConsentGiven } from '@/components/Privacy/CookieConsent'
import { DISTINCT_ID_COOKIE } from '@/experiments/constants'
import { CONFIG } from '@/utils/config'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined' && CONFIG.POSTHOG_TOKEN) {
  const distinctId = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${DISTINCT_ID_COOKIE}=`))
    ?.split('=')[1]

  posthog.init(CONFIG.POSTHOG_TOKEN, {
    ui_host: 'https://us.i.posthog.com',
    api_host: `${CONFIG.FRONTEND_BASE_URL}/ingest`,
    defaults: '2025-05-24', // enables automatic pageview tracking
    persistence: cookieConsentGiven() === 'yes' ? 'localStorage' : 'memory',
    bootstrap: distinctId ? { distinctID: distinctId } : undefined,
    disable_surveys: true,
  })
}

export function PolarPostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

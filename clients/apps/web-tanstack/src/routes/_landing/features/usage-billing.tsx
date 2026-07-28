import { UsageBillingPage } from '@/components/Landing/features/UsageBillingPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/usage-billing')({
  head: () =>
    getMarketingHead({
      title: 'Usage-Based Billing',
      description:
        'Bill what your customers actually use. Ingest events, aggregate them into meters, and charge with precision — built for tokens, API calls, and compute.',
      keywords:
        'usage billing, metered billing, consumption billing, pay-as-you-go, event ingestion, saas billing',
    }),
  component: UsageBillingPage,
})

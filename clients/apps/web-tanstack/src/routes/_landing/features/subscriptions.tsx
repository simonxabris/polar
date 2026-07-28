import { SubscriptionsPage } from '@/components/Landing/features/SubscriptionsPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/subscriptions')({
  head: () =>
    getMarketingHead({
      title: 'Subscriptions',
      description:
        'Recurring revenue on autopilot. Renewals, proration, dunning, and customer self-service — all handled.',
      keywords:
        'subscriptions, recurring billing, saas billing, proration, dunning, renewal, customer portal',
    }),
  component: SubscriptionsPage,
})

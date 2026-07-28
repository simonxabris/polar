import { PolarVsStripePage } from '@/components/Landing/comparison/PolarStripePage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/resources/comparison/stripe')({
  head: () =>
    getMarketingHead({
      title: 'Polar vs Stripe',
      description:
        'Polar vs Stripe: Polar is a Merchant of Record that handles payments, subscriptions, usage-based billing and global sales tax for you, while Stripe leaves tax and compliance to you.',
      keywords:
        'polar vs stripe, stripe alternative, merchant of record, saas billing, usage-based billing, payment infrastructure',
    }),
  component: PolarVsStripePage,
})

import { SeatsPage } from '@/components/Landing/features/SeatsPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/seats')({
  head: () =>
    getMarketingHead({
      title: 'Seat-Based Billing',
      description:
        'Pricing that scales with the team. Sell seat-based products with assignable seats, claim links, and automatic proration.',
      keywords:
        'seat-based pricing, team subscriptions, per-seat billing, volume discounts, graduated pricing',
    }),
  component: SeatsPage,
})

import { DiscountsPage } from '@/components/Landing/features/DiscountsPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/discounts')({
  head: () =>
    getMarketingHead({
      title: 'Discounts & Coupons',
      description:
        'Coupons, promo codes, and recurring discounts. Apply automatically at checkout, prefill via URL, or via the API.',
      keywords:
        'discounts, coupons, promo codes, percentage discount, fixed amount discount, recurring discount',
    }),
  component: DiscountsPage,
})

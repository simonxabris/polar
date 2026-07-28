import { PricingPage } from '@/components/Landing/resources/PricingPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/resources/pricing')({
  head: () =>
    getMarketingHead({
      title: 'Pricing',
      description: 'Transparent pricing for every stage of growth',
      keywords:
        'polar pricing, merchant of record fees, usage-based billing pricing, saas billing costs, transaction fees',
    }),
  component: PricingPage,
})

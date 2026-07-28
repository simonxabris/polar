import { PolarVsLemonSqueezyPage } from '@/components/Landing/comparison/PolarLemonSqueezyPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_landing/resources/comparison/lemon-squeezy',
)({
  head: () =>
    getMarketingHead({
      title: 'Polar vs Lemon Squeezy',
      description:
        'Polar vs Lemon Squeezy: compare two Merchant of Record platforms for developers, including open-source billing, usage-based pricing and transaction fees.',
      keywords:
        'polar vs lemon squeezy, lemon squeezy alternative, merchant of record, saas billing, digital products',
    }),
  component: PolarVsLemonSqueezyPage,
})

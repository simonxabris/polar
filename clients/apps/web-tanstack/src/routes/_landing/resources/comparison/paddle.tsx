import { PolarVsPaddlePage } from '@/components/Landing/comparison/PolarPaddlePage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/resources/comparison/paddle')({
  head: () =>
    getMarketingHead({
      title: 'Polar vs Paddle',
      description:
        'Polar vs Paddle: compare two Merchant of Record platforms for SaaS and digital products, including billing models, usage-based pricing and transaction fees.',
      keywords:
        'polar vs paddle, paddle alternative, merchant of record, saas billing, subscriptions, usage-based billing',
    }),
  component: PolarVsPaddlePage,
})

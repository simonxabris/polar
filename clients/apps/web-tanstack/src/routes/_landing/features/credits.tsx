import { CreditsPage } from '@/components/Landing/features/CreditsPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/features/credits')({
  head: () =>
    getMarketingHead({
      title: 'Credits & Prepaid Balances',
      description:
        'Prepaid usage for your API. Issue credits, draw down balances, and let metered pricing handle the overage.',
      keywords:
        'prepaid billing, api credits, usage credits, wallet, prepay, metered billing',
    }),
  component: CreditsPage,
})

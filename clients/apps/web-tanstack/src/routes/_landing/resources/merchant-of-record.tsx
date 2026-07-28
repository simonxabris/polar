import { MORPage } from '@/components/Landing/resources/MORPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/resources/merchant-of-record')({
  head: () =>
    getMarketingHead({
      title: 'Merchant of Record',
      description:
        'A deep dive into Merchant of Records & what they mean for you',
      keywords:
        'mor, merchant of record, lemon squeezy, paddle, taxes, compliance, monetization',
    }),
  component: MORPage,
})

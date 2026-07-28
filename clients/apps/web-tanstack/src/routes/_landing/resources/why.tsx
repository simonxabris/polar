import { WhyPolarPage } from '@/components/Landing/resources/WhyPolarPage'
import { getMarketingHead } from '@/utils/metadata'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/resources/why')({
  head: () =>
    getMarketingHead({
      title: 'Why Polar is the best way to monetize your software',
      description: 'Learn why Polar is the best way to monetize your software',
      keywords:
        'monetize, monetization, switch, migration, payment infrastructure, saas, monetization, developer tools',
    }),
  component: WhyPolarPage,
})

import LandingPage from '@/components/Landing/LandingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/')({
  head: () => ({
    meta: [
      {
        title: 'Polar — A billing platform for the intelligence era',
      },
      {
        name: 'description',
        content:
          'Polar is the Merchant of Record for developers building AI-era software: payments, subscriptions, and usage-based billing, with global tax handled for you.',
      },
      {
        name: 'keywords',
        content:
          'monetization, merchant of record, saas, digital products, platform, developer, open source, funding, open source, economy',
      },
      { property: 'og:site_name', content: 'Polar' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:image',
        content: 'https://polar.sh/assets/brand/polar_og.jpg',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: 'https://polar.sh/assets/brand/polar_og.jpg',
      },
      { name: 'twitter:image:alt', content: 'Polar' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://polar.sh/',
      },
    ],
  }),
  component: LandingPage,
})

import { CookieConsent } from '@/components/Privacy/CookieConsent'
import LandingLayout from '@/components/Landing/LandingLayout'
import { CONFIG } from '@/utils/config'
import { getCountryCode } from '@/utils/country.functions'
import { Outlet, createFileRoute } from '@tanstack/react-router'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://polar.sh/#organization',
      name: 'Polar',
      url: 'https://polar.sh/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://polar.sh/assets/brand/app-icon.png',
      },
      description:
        'Polar is an open source, developer-first monetization platform and Merchant of Record for software companies — handling payments, subscriptions, usage-based billing, and global tax compliance.',
      sameAs: ['https://github.com/polarsource', 'https://x.com/polar_sh'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://polar.sh/#website',
      name: 'Polar',
      url: 'https://polar.sh/',
      publisher: {
        '@id': 'https://polar.sh/#organization',
      },
    },
  ],
}

export const Route = createFileRoute('/_landing')({
  head: () => ({
    meta: [
      { title: 'Polar' },
      {
        name: 'description',
        content: 'A billing platform for the intelligence era',
      },
      { property: 'og:site_name', content: 'Polar' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Polar | A billing platform for the intelligence era',
      },
      {
        property: 'og:description',
        content:
          'Create digital products and SaaS billing with flexible pricing models and seamless payment processing.',
      },
      { property: 'og:locale', content: 'en_US' },
      {
        property: 'og:image',
        content: 'https://polar.sh/assets/brand/polar_og.jpg',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Polar | A billing platform for the intelligence era',
      },
      {
        name: 'twitter:description',
        content:
          'Create digital products and SaaS billing with flexible pricing models and seamless payment processing.',
      },
      {
        name: 'twitter:image',
        content: 'https://polar.sh/assets/brand/polar_og.jpg',
      },
      {
        name: 'robots',
        content: CONFIG.IS_SANDBOX ? 'noindex, nofollow' : 'index, follow',
      },
      {
        name: 'googlebot',
        content: CONFIG.IS_SANDBOX
          ? 'noindex, nofollow'
          : 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      },
    ],
  }),
  loader: () => getCountryCode(),
  component: LandingLayoutRoute,
})

function LandingLayoutRoute() {
  const countryCode = Route.useLoaderData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <LandingLayout>
        <Outlet />
      </LandingLayout>
      <CookieConsent countryCode={countryCode} />
    </>
  )
}

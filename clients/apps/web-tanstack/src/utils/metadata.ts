const DEFAULT_SOCIAL_IMAGE = 'https://polar.sh/assets/brand/polar_og.jpg'

interface MarketingMetadata {
  title: string
  description: string
  keywords?: string
  image?: string
}

export const getMarketingHead = ({
  title,
  description,
  keywords,
  image = DEFAULT_SOCIAL_IMAGE,
}: MarketingMetadata) => ({
  meta: [
    { title },
    { name: 'description', content: description },
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
    { property: 'og:site_name', content: 'Polar' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:width', content: '1200' },
    { name: 'twitter:image:height', content: '630' },
    { name: 'twitter:image:alt', content: 'Polar' },
  ],
})

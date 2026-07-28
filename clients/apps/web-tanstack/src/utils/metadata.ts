const DEFAULT_SOCIAL_IMAGE = 'https://polar.sh/assets/brand/polar_og.jpg'

interface MarketingMetadata {
  title: string
  description: string
  keywords?: string
  image?: string
  type?: 'article' | 'website'
  publishedTime?: string
}

export const getMarketingHead = ({
  title,
  description,
  keywords,
  image = DEFAULT_SOCIAL_IMAGE,
  type = 'website',
  publishedTime,
}: MarketingMetadata) => ({
  meta: [
    { title },
    { name: 'description', content: description },
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
    { property: 'og:site_name', content: 'Polar' },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    ...(publishedTime
      ? [{ property: 'article:published_time', content: publishedTime }]
      : []),
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

export const getArticleHead = (metadata: Omit<MarketingMetadata, 'type'>) =>
  getMarketingHead({ ...metadata, type: 'article' })

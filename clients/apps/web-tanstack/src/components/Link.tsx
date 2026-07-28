import { Link as TanStackLink } from '@tanstack/react-router'
import { forwardRef, type AnchorHTMLAttributes } from 'react'

export interface LinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  href: string
  prefetch?: boolean
}

/**
 * Routes that have been migrated to this app. Links pointing anywhere else
 * render plain anchors (full-page navigation) until their route is migrated.
 */
const MIGRATED_ROUTES = new Set([
  '/',
  '/blog',
  '/blog/introducing-polar-plans',
  '/blog/mitchell-hashimoto-joins-polar-as-an-advisor',
  '/blog/orbit-llm-safe-design-system',
  '/blog/polar-seed-announcement',
  '/blog/prompt-a-startup-2026',
  '/company',
  '/customers/stilla-ai',
  '/downloads',
  '/features/cost-insights',
  '/features/credits',
  '/features/discounts',
  '/features/finance',
  '/features/merchant-of-record',
  '/features/seats',
  '/features/subscriptions',
  '/features/trials',
  '/features/usage-billing',
  '/legal',
  '/legal/acceptable-use-policy',
  '/legal/checkout-buyer-terms',
  '/legal/data-processing-addendum',
  '/legal/master-services-terms',
  '/legal/payment-processor-partners',
  '/legal/privacy-policy',
  '/legal/sub-processors',
  '/resources',
  '/resources/comparison/lemon-squeezy',
  '/resources/comparison/paddle',
  '/resources/comparison/stripe',
  '/resources/merchant-of-record',
  '/resources/pricing',
  '/resources/why',
  '/startup-program',
])

/**
 * Incremental-migration shim for next/link. Migrated internal routes render a
 * TanStack Router <Link> (client-side navigation); everything else renders a
 * plain anchor.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, prefetch: _prefetch, children, ...props }, ref) => {
    const isExternal = /^(https?:|mailto:)/.test(href)
    const [path, hash] = href.split('#')

    if (isExternal || !MIGRATED_ROUTES.has(path || '/')) {
      return (
        <a href={href} ref={ref} {...props}>
          {children}
        </a>
      )
    }

    return (
      <TanStackLink to={path || '/'} hash={hash} ref={ref} {...props}>
        {children}
      </TanStackLink>
    )
  },
)

Link.displayName = 'Link'

export default Link

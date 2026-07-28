import CheckoutBuyerTerms from '@/content/legal/checkout-buyer-terms.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/legal/checkout-buyer-terms')({
  head: () => ({ meta: [{ title: 'Polar Buyer Terms and Conditions' }] }),
  component: CheckoutBuyerTermsPage,
})

function CheckoutBuyerTermsPage() {
  return <CheckoutBuyerTerms components={mdxComponents} />
}

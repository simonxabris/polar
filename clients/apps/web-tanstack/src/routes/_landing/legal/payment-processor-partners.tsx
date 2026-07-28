import PaymentProcessorPartners from '@/content/legal/payment-processor-partners.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_landing/legal/payment-processor-partners',
)({
  head: () => ({
    meta: [{ title: 'Polar Payment Processing Partners' }],
  }),
  component: PaymentProcessorPartnersPage,
})

function PaymentProcessorPartnersPage() {
  return <PaymentProcessorPartners components={mdxComponents} />
}

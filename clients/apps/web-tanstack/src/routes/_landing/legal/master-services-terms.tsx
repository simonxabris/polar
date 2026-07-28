import MasterServicesTerms from '@/content/legal/master-services-terms.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/legal/master-services-terms')({
  head: () => ({ meta: [{ title: 'Polar Master Services Terms' }] }),
  component: MasterServicesTermsPage,
})

function MasterServicesTermsPage() {
  return <MasterServicesTerms components={mdxComponents} />
}

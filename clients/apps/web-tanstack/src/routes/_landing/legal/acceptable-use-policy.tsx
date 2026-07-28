import AcceptableUsePolicy from '@/content/legal/acceptable-use-policy.mdx'
import { mdxComponents } from '@/mdx-components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/legal/acceptable-use-policy')({
  head: () => ({ meta: [{ title: 'Polar Acceptable Use Policy' }] }),
  component: AcceptableUsePolicyPage,
})

function AcceptableUsePolicyPage() {
  return <AcceptableUsePolicy components={mdxComponents} />
}
